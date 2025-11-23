# apps/reservas/admin.py
from django.contrib import admin
from .models import Espacio, Reserva, Notificacion


@admin.register(Espacio)
class EspacioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo', 'capacidad', 'color', 'activo', 'creado_en']
    list_filter = ['tipo', 'activo']
    search_fields = ['nombre', 'descripcion']
    ordering = ['nombre']
    readonly_fields = ['creado_en', 'actualizado_en']


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'espacio', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'creado_en']
    list_filter = ['estado', 'fecha', 'espacio', 'creado_en']
    search_fields = ['usuario__nombre', 'usuario__email', 'espacio__nombre', 'motivo']
    ordering = ['-fecha', '-hora_inicio']
    readonly_fields = ['creado_en', 'actualizado_en']
    date_hierarchy = 'fecha'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('usuario', 'espacio', 'estado')
        }),
        ('Fecha y Horario', {
            'fields': ('fecha', 'hora_inicio', 'hora_fin')
        }),
        ('Detalles', {
            'fields': ('motivo', 'numero_personas')
        }),
        ('Auditoría', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'tipo', 'titulo', 'leida', 'creado_en']
    list_filter = ['tipo', 'leida', 'creado_en']
    search_fields = ['usuario__nombre', 'titulo', 'mensaje']
    ordering = ['-creado_en']
    readonly_fields = ['creado_en']