from rest_framework import serializers
from .models import Usuario

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Cambia el campo username_field para que sea email
    username_field = 'email'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'password', 'telefono', 'direccion']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'default': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['is_active'] = True 
        usuario = Usuario(**validated_data)
        usuario.set_password(password)  # encripta la contraseña
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # encripta la contraseña si la envían
        instance.save()
        return instance


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Reemplazar "username" por "email"
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)