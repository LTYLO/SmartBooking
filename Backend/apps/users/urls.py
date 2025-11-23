# apps/users/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet, EmailTokenObtainPairView, register_user, get_user_info

router = routers.DefaultRouter()
router.register(r'', UsuarioViewSet, basename='usuarios')

urlpatterns = [
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', register_user, name='register'),
    path('info/', get_user_info, name='user_info'),
    path('', include(router.urls)),
]