# apps/reservas/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime
from .models import Espacio, Reserva, Notificacion
from .serializers import (
    EspacioSerializer,
    ReservaListSerializer,
    ReservaDetailSerializer,
    ReservaCreateUpdateSerializer,
    NotificacionSerializer
)


class EspacioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar espacios"""
    queryset = Espacio.objects.all()
    serializer_class = EspacioSerializer
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'tipo', 'descripcion']
    ordering_fields = ['nombre', 'capacidad', 'creado_en']
    
    def get_queryset(self):
        return Espacio.objects.filter(activo=True)


class ReservaViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar reservas"""
    queryset = Reserva.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['espacio__nombre', 'usuario__nombre', 'motivo']
    ordering_fields = ['fecha', 'hora_inicio', 'creado_en']

    def get_permissions(self):
        """Solo requiere autenticación para crear, actualizar o eliminar"""
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'cancelar']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReservaCreateUpdateSerializer
        elif self.action == 'retrieve':
            return ReservaDetailSerializer
        return ReservaListSerializer
    
    def get_queryset(self):
        """Obtener reservas - usuarios no autenticados ven todas las confirmadas"""
        queryset = Reserva.objects.select_related('usuario', 'espacio')
        
        # Aplicar filtros de query params
        estado = self.request.query_params.get('estado')
        espacio_id = self.request.query_params.get('espacio')
        fecha = self.request.query_params.get('fecha')
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')
        
        if estado:
            queryset = queryset.filter(estado=estado)
        if espacio_id:
            queryset = queryset.filter(espacio_id=espacio_id)
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)
        
        # Si NO está autenticado, solo mostrar reservas confirmadas/pendientes
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(estado__in=['pendiente', 'confirmada'])
        # Si está autenticado pero no es admin, mostrar sus reservas
        elif not self.request.user.is_staff:
            queryset = queryset.filter(usuario=self.request.user)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancelar(self, request, pk=None):
        """Cancela una reserva"""
        reserva = self.get_object()
        
        if reserva.usuario != request.user and not request.user.is_staff:
            return Response(
                {'error': 'No tienes permiso para cancelar esta reserva'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if reserva.estado == 'cancelada':
            return Response(
                {'error': 'La reserva ya está cancelada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reserva.estado = 'cancelada'
        reserva.save()
        
        return Response(ReservaDetailSerializer(reserva).data)


class NotificacionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar notificaciones"""
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user)