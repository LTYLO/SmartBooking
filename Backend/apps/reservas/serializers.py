# apps/reservas/serializers.py
from rest_framework import serializers
from .models import Espacio, Reserva, Notificacion
from apps.users.serializers import UsuarioSerializer


class EspacioSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    total_reservas = serializers.SerializerMethodField()
    
    class Meta:
        model = Espacio
        fields = [
            'id', 'nombre', 'tipo', 'tipo_display', 'descripcion',
            'capacidad', 'color', 'activo', 'imagen',
            'total_reservas', 'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['creado_en', 'actualizado_en']
    
    def get_total_reservas(self, obj):
        return obj.reservas.filter(estado__in=['pendiente', 'confirmada']).count()


class ReservaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar reservas"""
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    espacio_nombre = serializers.CharField(source='espacio.nombre', read_only=True)
    espacio_color = serializers.CharField(source='espacio.color', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'usuario', 'usuario_nombre', 'usuario_email',
            'espacio', 'espacio_nombre', 'espacio_color',
            'fecha', 'hora_inicio', 'hora_fin',
            'estado', 'estado_display', 'motivo', 'numero_personas',
            'creado_en'
        ]


class ReservaDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado con información completa"""
    usuario = UsuarioSerializer(read_only=True)
    espacio = EspacioSerializer(read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'usuario', 'espacio', 'fecha', 'hora_inicio', 'hora_fin',
            'estado', 'estado_display', 'motivo', 'numero_personas',
            'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['creado_en', 'actualizado_en']


class ReservaCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para crear y actualizar reservas"""
    
    class Meta:
        model = Reserva
        fields = [
            'id', 'espacio', 'fecha', 'hora_inicio', 'hora_fin',
            'estado', 'motivo', 'numero_personas'
        ]
    
    def validate(self, data):
        """Validaciones adicionales"""
        espacio = data.get('espacio')
        fecha = data.get('fecha')
        hora_inicio = data.get('hora_inicio')
        hora_fin = data.get('hora_fin')
        
        # Validar que el espacio esté activo
        if espacio and not espacio.activo:
            raise serializers.ValidationError({
                'espacio': 'Este espacio no está disponible para reservas'
            })
        
        # Validar horarios
        if hora_inicio and hora_fin and hora_inicio >= hora_fin:
            raise serializers.ValidationError({
                'hora_fin': 'La hora de fin debe ser posterior a la hora de inicio'
            })
        
        return data
    
    def create(self, validated_data):
        # Asignar el usuario actual
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class NotificacionSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    reserva_detalle = ReservaListSerializer(source='reserva', read_only=True)
    
    class Meta:
        model = Notificacion
        fields = [
            'id', 'tipo', 'tipo_display', 'titulo', 'mensaje',
            'leida', 'reserva', 'reserva_detalle', 'creado_en'
        ]
        read_only_fields = ['creado_en']