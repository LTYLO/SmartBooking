# apps/reservas/models.py
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone


class Espacio(models.Model):
    """Modelo para los espacios que se pueden reservar"""
    TIPOS_ESPACIO = [
        ('sala_reuniones', 'Sala de Reuniones'),
        ('auditorio', 'Auditorio'),
        ('cancha', 'Cancha Deportiva'),
        ('area_juegos', 'Área de Juegos'),
        ('otro', 'Otro'),
    ]
    
    nombre = models.CharField(max_length=200, unique=True)
    tipo = models.CharField(max_length=50, choices=TIPOS_ESPACIO)
    descripcion = models.TextField(blank=True, null=True)
    capacidad = models.IntegerField(help_text="Capacidad máxima de personas")
    color = models.CharField(max_length=7, default='#007bff', help_text="Color hex para el calendario")
    activo = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='espacios/', blank=True, null=True)
    
    # Campos de auditoría
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Espacio'
        verbose_name_plural = 'Espacios'
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"


class Reserva(models.Model):
    """Modelo para las reservas de espacios"""
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ]
    
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservas'
    )
    espacio = models.ForeignKey(
        'Espacio',
        on_delete=models.CASCADE,
        related_name='reservas'
    )
    
    # Fecha y horarios
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    
    # Estado y detalles
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    motivo = models.TextField(blank=True, null=True, help_text="Motivo o descripción de la reserva")
    numero_personas = models.IntegerField(blank=True, null=True)
    
    # Campos de auditoría
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-fecha', '-hora_inicio']
        indexes = [
            models.Index(fields=['fecha', 'espacio']),
            models.Index(fields=['usuario', 'estado']),
        ]
    
    def __str__(self):
        return f"{self.usuario.nombre} - {self.espacio.nombre} - {self.fecha}"
    
    def clean(self):
        """Validaciones personalizadas"""
        # Validar que hora_fin sea mayor que hora_inicio
        if self.hora_inicio and self.hora_fin and self.hora_inicio >= self.hora_fin:
            raise ValidationError('La hora de fin debe ser posterior a la hora de inicio')
        
        # Validar que la fecha no sea en el pasado
        if self.fecha and self.fecha < timezone.now().date():
            raise ValidationError('No se pueden crear reservas en fechas pasadas')
        
        # Validar capacidad
        if self.numero_personas and self.espacio:
            if self.numero_personas > self.espacio.capacidad:
                raise ValidationError(
                    f'El número de personas ({self.numero_personas}) excede la capacidad del espacio ({self.espacio.capacidad})'
                )
        
        # Validar conflictos de horario
        if self.espacio and self.fecha and self.hora_inicio and self.hora_fin:
            conflictos = Reserva.objects.filter(
                espacio=self.espacio,
                fecha=self.fecha,
                estado__in=['pendiente', 'confirmada']
            ).exclude(pk=self.pk)
            
            for reserva in conflictos:
                # Verificar si hay solapamiento de horarios
                if not (self.hora_fin <= reserva.hora_inicio or self.hora_inicio >= reserva.hora_fin):
                    raise ValidationError(
                        f'Ya existe una reserva para este espacio en este horario. '
                        f'Conflicto con reserva de {reserva.usuario.nombre} ({reserva.hora_inicio}-{reserva.hora_fin})'
                    )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Notificacion(models.Model):
    """Modelo para notificaciones de reservas"""
    TIPOS = [
        ('confirmacion', 'Confirmación de Reserva'),
        ('recordatorio', 'Recordatorio'),
        ('cancelacion', 'Cancelación'),
        ('modificacion', 'Modificación'),
    ]
    
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notificaciones'
    )
    reserva = models.ForeignKey(
        'Reserva',
        on_delete=models.CASCADE,
        related_name='notificaciones',
        blank=True,
        null=True
    )
    
    tipo = models.CharField(max_length=20, choices=TIPOS)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    leida = models.BooleanField(default=False)
    
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-creado_en']
    
    def __str__(self):
        return f"{self.usuario.nombre} - {self.titulo}"