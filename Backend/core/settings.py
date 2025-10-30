from pathlib import Path
import os
import environ

# ==============================
# CONFIGURACIÓN BASE
# ==============================

env = environ.Env()
environ.Env.read_env()  # Carga las variables del archivo .env

BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
# SEGURIDAD
# ==============================

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = env.list('ALLOWED_HOST_DEV', default=[])

# ==============================
# APLICACIONES
# ==============================

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

PROJECT_APPS = [
]

THIRD_PARTY_APPS = [
    'corsheaders',
    'rest_framework',
    'django_ckeditor_5'
]

INSTALLED_APPS = DJANGO_APPS + PROJECT_APPS + THIRD_PARTY_APPS

# ==============================
# CKEDITOR CONFIG
# ==============================

CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': ['heading', '|', 'bold', 'italic', 'link',
                    'bulletedList', 'numberedList', 'blockQuote'],
    },
}

CKEDITOR_UPLOAD_PATH = 'media/'

# ==============================
# MIDDLEWARE
# ==============================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==============================
# URLS Y WSGI
# ==============================

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Puedes añadir rutas a templates personalizados si los tienes
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ==============================
# BASE DE DATOS
# ==============================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==============================
# VALIDACIÓN DE CONTRASEÑAS
# ==============================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==============================
# LOCALIZACIÓN
# ==============================

LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# ==============================
# ARCHIVOS ESTÁTICOS Y MEDIA
# ==============================

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Si tienes un proyecto React compilado con npm run build
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build', 'static'),
]

# ==============================
# CONFIGURACIÓN DE REST FRAMEWORK
# ==============================

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ]
}

# ==============================
# CORS Y CSRF
# ==============================

CORS_ORIGIN_WHITELIST = env.list('CORS_ORIGIN_WHITELIST_DEV', default=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])

CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS_DEV', default=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])

# ==============================
# CONFIGURACIÓN PARA PRODUCCIÓN
# ==============================

if not DEBUG:
    ALLOWED_HOSTS = env.list('ALLOWED_HOSTS_DEPLOY', default=[])
    CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS_DEPLOY', default=[])
    DATABASES = {"default": env.db("DATABASE_URL")}
    DATABASES["default"]["ATOMIC_REQUESTS"] = True

# ==============================
# CONFIGURACIÓN FINAL
# ==============================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
