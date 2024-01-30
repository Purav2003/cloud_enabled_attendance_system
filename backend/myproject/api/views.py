from rest_framework.response import Response    
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from base.models import User,Admin
from .serializers import UserSerializer,AdminSerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt,datetime
from .decoretors import jwt_authorization
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import random


# from facenet_pytorch import InceptionResnetV1, MTCNN, extract_face
# from PIL import Image
# import numpy as np

# @api_view(['POST'])
# def match_face(request):
#     # Get the image link from the request data
#     image_url = request.data.get('image_url')  # Assuming the image URL is provided in the request data
#     response = requests.get(image_url)

#     if response.status_code == 200:
#         # Save the image to a file
#         image_path = '/content/downloaded_image.png'
#         with open(image_path, 'wb') as f:
#             f.write(response.content)
#     model = InceptionResnetV1(pretrained='vggface2').eval()

#     image_path_1 = '/content/Untitled.png'
#     image_path_2 = '/content/vk.jpg'

#     img_1 = Image.open(image_path_1)
#     img_2 = Image.open(image_path_2)

#     img_1 = img_1.convert('RGB')
#     img_2 = img_2.convert('RGB')

#     # Convert images to PyTorch tensors
#     img_tensor_1 = MTCNN()(img_1)
#     img_tensor_2 = MTCNN()(img_2)



#     # Expand dimensions to create batches with a single image each
#     img_tensor_1 = img_tensor_1.unsqueeze(0)
#     img_tensor_2 = img_tensor_2.unsqueeze(0)

# # Get face embeddings
#     embeddings_1 = model(img_tensor_1)
#     embeddings_2 = model(img_tensor_2)

# # Convert embeddings to numpy arrays for comparison
#     embeddings_1_np = embeddings_1.cpu().detach().numpy()
#     embeddings_2_np = embeddings_2.cpu().detach().numpy()

# # Calculate the Euclidean distance between the embeddings
#     distance = np.linalg.norm(embeddings_1_np - embeddings_2_np)

# # Set a threshold for recognition
#     threshold = 0.7

# # Compare distances for recognition
#     if distance < threshold:
#         print("The faces are recognized as the same person.")
#     else:
#         print("The faces are recognized as different persons.")


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = User.objects.get(email=email) if User.objects.filter(email=email).exists() else None    
    
    if user:
        if check_password(password, user.password):
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt':token,
                'status':'success',
                'id':user.id,
                'isAuthorized':user.isAuthorized,
            }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
@jwt_authorization
def getData(request,pk):
    items = User.objects.filter(companyCode=pk)
    serializer = UserSerializer(items,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    mobile = request.data.get('mobile')
    companyCode = request.data.get('companyCode')
    admin = Admin.objects.get(companyCode=companyCode) if Admin.objects.filter(companyCode=companyCode).exists() else None    

    print(mobile)
    mobile = str(mobile)
    print(mobile)
    user_email = None
    # user_phone = None
    print(mobile)
    try:
        user_email = User.objects.get(email=email) 
    except:
        user_email= None
    try:
        user_phone = User.objects.get(mobile=mobile) 
    except:
        user_phone = None
    print(user_phone)
    if user_email is None and user_phone is None and admin is not None:
        generated_otp = str(random.randint(1000, 9999))
        send_otp_email(email, generated_otp)

        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        request.data['otp'] = generated_otp
        serializer = UserSerializer(data=request.data)
        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        print(request.data)
        if serializer.is_valid():    
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully','email':email}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if user_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        elif admin is None:
            return Response({'status': 'error', 'message': 'Invalid Company Code'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Mobile already exists'}, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(receiver_email, otp):
    # Send the OTP to the user's email using Django's send_mail function
    subject = 'Your OTP for Sign Up'
    message = f'Your OTP for sign up is: {otp}'
    from_email = 'workwidpurav@gmail.com'  # Replace with your Gmail email address
    recipient_list = [receiver_email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

@api_view(['POST'])
def checkOtp(request,pk):
    items = User.objects.get(email=pk)
    otp = request.data.get('otp')
    otp = str(otp)
    otp_1 = str(items.otp)
    print(otp)
    print(items.otp)
    if otp_1 == otp:
        return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def updateItem(request,pk):
    items = User.objects.get(id=pk)
    serializer = UserSerializer(data=request.data,instance=items)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def delItem(request,pk):
    delete_it = User.objects.get(id=pk)
    delete_it.delete()
    return Response()

@api_view(['GET'])
@jwt_authorization
def customer_record(request,pk):   
    items = User.objects.get(id=pk)
    if items is not None:
        serializer = UserSerializer(items)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@jwt_authorization
def access(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    user.isAuthorized = True
    user.save()
    return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
   
### ADMIN ###

@api_view(['POST'])
def adminSignup(request):
    email = request.data.get('email')
    mobile = request.data.get('mobile')
    companyCode = request.data.get('companyCode')
    password = request.data.get('password')
    mobile = str(mobile)
   
    try:
        admin_email = Admin.objects.get(email=email) 
    except:
        admin_email= None
    try:
        admin_phone = Admin.objects.get(mobile=mobile) 
    except:
        admin_phone = None
    try:
        company_code = Admin.objects.get(companyCode=companyCode) 
    except:
        company_code = None
        
    if admin_email is None and admin_phone is None and company_code is None:
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():            
            # encrypted_password = make_password(password)            
            # serializer.validated_data['password'] = encrypted_password
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if admin_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        elif admin_phone is not None:
            return Response({'status': 'error', 'message': 'Mobile already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Company Code already exists'}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def adminLogin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    admin = Admin.objects.get(email=email) if Admin.objects.filter(email=email).exists() else None    

    if admin:
        print(f"Database Password: {admin.password}")
        print(f"Entered Password: {password}")

        if check_password(password, admin.password):
            payload = {
                'id': admin.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt':token,
                'status':'success',
                'id':admin.id,
                'companyName':admin.companyName,
                'companyCode':admin.companyCode,
            }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
   