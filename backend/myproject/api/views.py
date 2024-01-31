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
import requests
import base64
from io import BytesIO
from PIL import Image
from django.contrib.auth.models import User
import cv2
import numpy as np

@api_view(['POST'])
def match_face(request):
    try:
        # Get the image data from the request
        image_data = request.data.get('data')  # Assuming 'data' is the key for the image data

        # Decode base64 and convert to PIL Image
        image = Image.open(BytesIO(base64.b64decode(image_data)))

        # Convert PIL Image to OpenCV format (BGR)
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Load the pre-trained face recognition model
        model = cv2.dnn.readNetFromTensorflow('path/to/pretrained/model.pb')

        # Get face locations using a face detection model (e.g., MTCNN)
        face_locations = face_detection(cv_image)

        if not face_locations:
            return Response({'message': 'No face found in the image'}, status=404)

        # Extract face embeddings using the pre-trained model
        embeddings = []
        for face_location in face_locations:
            face = cv_image[face_location[0]:face_location[2], face_location[3]:face_location[1]]
            blob = cv2.dnn.blobFromImage(face, 1.0, (96, 96), (0, 0, 0), swapRB=True, crop=False)
            model.setInput(blob)
            embedding = model.forward()
            embeddings.append(embedding.flatten())

        # Loop through all users and their photos
        for user in User.objects.all():
            for user_photo in user.userprofile.photos.all():
                # Load the user's photo and get its embedding
                user_photo_path = user_photo.photo.path
                user_photo_image = cv2.imread(user_photo_path)
                user_photo_blob = cv2.dnn.blobFromImage(user_photo_image, 1.0, (96, 96), (0, 0, 0), swapRB=True, crop=False)
                model.setInput(user_photo_blob)
                user_photo_embedding = model.forward().flatten()

                # Compare the embeddings
                distance = np.linalg.norm(embeddings - user_photo_embedding)
                
                # If the distance is below a certain threshold, consider it a match
                if distance < 0.6:  # You can adjust this threshold based on your needs
                    return Response({'message': f'Match found for user: {user.username}'}, status=200)

        # If no match is found, return 'User not found'
        return Response({'message': 'User not found'}, status=404)

    except Exception as e:
        # Handle exceptions appropriately
        return Response({'error': str(e)}, status=500)

def face_detection(image):
    # Use a face detection model (e.g., MTCNN) to get face locations
    # Example: You can replace this with your preferred face detection approach
    # and modify the return format as needed.
    # Refer to the documentation of the chosen face detection model.
    pass


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = User.objects.get(email=email) if User.objects.filter(email=email).exists() else None    
    
    if user:
        if check_password(password, user.password):
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=48),
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
   