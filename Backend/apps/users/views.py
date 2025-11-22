# Usuarios/views.py
from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer

from django.contrib.auth.hashers import make_password

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    

# apps/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from django.contrib.auth.hashers import make_password

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from django.contrib.auth.hashers import make_password

@method_decorator(csrf_exempt, name='dispatch')
class RegisterUser(APIView):
    def post(self, request):
        data = request.data
        try:
            user = Usuario.objects.create_user(
                email=data.get('email'),
                password=data.get('password'),
                nombre=data.get('nombre', ''),
                telefono=data.get('telefono', ''),
                direccion=data.get('direccion', '')
            )
            return Response({"message": "Usuario creado exitosamente"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        'username': request.user.username,
        'email': request.user.email,
        # Puedes incluir otros campos si quieres
    })



# En apps/users/views.py - AGREGAR:

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        user = Usuario.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            nombre=data.get('nombre', ''),
            telefono=data.get('telefono', ''),
            direccion=data.get('direccion', '')
        )
        return Response({
            "message": "Usuario creado exitosamente",
            "user_id": user.id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)