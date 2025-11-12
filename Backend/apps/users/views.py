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
    def get(self, request):
        return Response({"message": "Usa POST para registrar usuario"}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        user = Usuario(
            email=data.get('email'),
            password=make_password(data.get('password')),
        )
        user.save()
        return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)

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
