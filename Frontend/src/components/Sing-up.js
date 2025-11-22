import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from 'assets/img/background.jpg';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const UsuarioForm = ({ usuarioId, onSuccess }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    if (usuarioId) {
      setLoading(true);
      fetch(`http://localhost:8000/api/users/${usuarioId}/`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            nombre: data.nombre || '',
            email: data.email || '',
            password: '',
            telefono: data.telefono || '',
            direccion: data.direccion || '',
            edad: data.edad || '',
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener usuario:', err);
          setLoading(false);
          if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' ||
              err.message.includes('Network Error') || err.message.includes('fetch') || !err.response) {
            setServerError(true);
            setTimeout(() => {
              navigate('/Sing_Up');
              navigate('/error/500_sing');
            }, 3000);
          }
        });
    }
  }, [usuarioId, navigate]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Usuario creado correctamente. Ahora puedes iniciar sesión.');
        setError(false);
        setFormData({ nombre: '', email: '', password: '', telefono: '', direccion: '' });
        setTimeout(() => navigate('/InciarSesion'), 2000);
      } else {
        setMensaje(data.email?.[0] || data.password?.[0] || 'Error al crear el usuario');
        setError(true);
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (serverError) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${logo2})`, filter: 'blur(3px)', transform: 'scale(1.02)' }} />
        <div className="fixed inset-0 -z-10 bg-white/30" />
        <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl p-8 rounded-2xl w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e5e5e5] border-t-[#c9b39c] mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-[#3d3d3d] mb-4">Error de Conexión</h2>
          <p className="text-[#6d6d6d] text-lg">Redirigiendo al manejo de errores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Fondo con imagen y blur sutil */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${logo2})`, filter: 'blur(3px)', transform: 'scale(1.02)' }} />
      <div className="fixed inset-0 -z-10 bg-white/30" />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            SMARTBOOKING
          </h1>
          <p className="text-[#4a4035] text-sm font-semibold">Sistema de reserva de espacios compartidos</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-[#c9b39c] px-6 py-6">
            <h2 className="text-2xl font-bold text-center text-white">
              {usuarioId ? 'Editar Cuenta' : 'Crear Cuenta'}
            </h2>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8">
            <div className="space-y-5">
              {/* Nombre completo */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5d5d5d]">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5d5d5d]">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5d5d5d]">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder={usuarioId ? 'Dejar en blanco para no cambiar' : 'Crea una contraseña segura'}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  {...(!usuarioId && { required: true })}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#5d5d5d]">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Tu dirección completa"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                />
              </div>

              {/* Teléfono y edad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#5d5d5d]">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Número de teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#5d5d5d]">Edad</label>
                  <input
                    type="number"
                    name="edad"
                    placeholder="Tu edad"
                    value={formData.edad}
                    onChange={handleChange}
                    min="0"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#c9b39c] hover:bg-[#b8a28b] disabled:bg-[#d4c4b0] text-white font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    <span>{usuarioId ? 'Actualizando...' : 'Creando...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{usuarioId ? 'Actualizar Cuenta' : 'Crear Cuenta'}</span>
                  </>
                )}
              </button>

              {/* Mensaje de respuesta */}
              {mensaje && (
                <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  error ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'
                }`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {error ? (
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{mensaje}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#6d6d6d]">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-[#c9b39c] hover:text-[#b8a28b] font-bold transition-colors duration-300">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;