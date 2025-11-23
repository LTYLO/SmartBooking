
# apps/reservas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EspacioViewSet, ReservaViewSet, NotificacionViewSet

router = DefaultRouter()
router.register(r'espacios', EspacioViewSet, basename='espacios')
router.register(r'reservas', ReservaViewSet, basename='reservas')
router.register(r'notificaciones', NotificacionViewSet, basename='notificaciones')

urlpatterns = [
    path('', include(router.urls)),
]