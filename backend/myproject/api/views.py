from rest_framework.response import Response    
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from base.models import User,Admin
from .serializers import UserSerializer,AdminSerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt,datetime
from .decoretors import jwt_authorization
from django.contrib.auth.hashers import make_password


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
        serializer = UserSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():            
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if user_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        elif admin is None:
            return Response({'status': 'error', 'message': 'Invalid Company Code'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Mobile already exists'}, status=status.HTTP_400_BAD_REQUEST)



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
   