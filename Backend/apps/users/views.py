# apps/users/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Usuario
from .serializers import UsuarioSerializer, EmailTokenObtainPairSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Endpoint para registrar nuevos usuarios"""
    # Para debug - ver qué datos llegan
    print("=== DATOS RECIBIDOS ===")
    print(request.data)
    print("======================")
    
    try:
        serializer = UsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Usuario creado exitosamente",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "nombre": user.nombre
                }
            }, status=status.HTTP_201_CREATED)
        else:
            # Mostrar errores específicos
            print("=== ERRORES DE VALIDACIÓN ===")
            print(serializer.errors)
            print("=============================")
            return Response({
                "error": "Datos inválidos",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print("=== ERROR EXCEPTION ===")
        print(str(e))
        print("======================")
        return Response({
            "error": "Error al crear usuario",
            "details": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """Obtiene información del usuario autenticado"""
    return Response({
        'id': request.user.id,
        'nombre': request.user.nombre,
        'email': request.user.email,
        'telefono': request.user.telefono or '',
        'direccion': request.user.direccion or ''
    })