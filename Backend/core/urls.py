from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    #path('api/', include('apps.users.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', TemplateView.as_view(template_name='index.html')),
    
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

"""
if settings.TEMPLATES[0]['DIRS']:
    urlpatterns += [
        re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
    ]

# Servir media y estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    if settings.STATICFILES_DIRS:
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

"""