# apps/users/urls.py
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet
from django.urls import path, include
from .views import EmailTokenObtainPairView
from .views import get_user_info

from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet
from .views import register_user

router = routers.DefaultRouter()
router.register(r'', UsuarioViewSet, basename='usuarios')
"""
router = DefaultRouter()
router.register(r'', UsuarioViewSet)
"""

urlpatterns = [
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', register_user, name='register'),
    path('', include(router.urls)),
    path('api/users/', get_user_info),
]

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

from apps.users.serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
