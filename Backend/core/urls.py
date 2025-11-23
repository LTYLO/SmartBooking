# core/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from apps.users.views import EmailTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/reservas/', include('apps.reservas.urls')),  # ← AGREGAR ESTA LÍNEA
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('', TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]