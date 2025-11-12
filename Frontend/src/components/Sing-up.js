import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    edad: '',
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
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
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
          
          if (err.code === 'ECONNREFUSED' ||
              err.code === 'ERR_NETWORK' ||
              err.message.includes('Network Error') ||
              err.message.includes('fetch') ||
              !err.response) {
            console.log('Error de conexión detectado, redirigiendo...');
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

    const csrfToken = getCookie('csrftoken');

    const url = usuarioId
      ? `http://localhost:8000/api/users/${usuarioId}/`
      : 'http://localhost:8000/api/users/';
    const method = usuarioId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(usuarioId ? 'Usuario actualizado con éxito.' : 'Usuario creado correctamente.');
        setError(false);
        if (!usuarioId) {
          setFormData({
            nombre: '',
            email: '',
            password: '',
            telefono: '',
            direccion: '',
            edad: '',
          });
        }
        if (onSuccess) onSuccess();
      } else {
        setMensaje(data.detail || 'Error al enviar el formulario.');
        setError(true);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setLoading(false);
      
      if (err.code === 'ECONNREFUSED' ||
          err.code === 'ERR_NETWORK' ||
          err.message.includes('Network Error') ||
          err.message.includes('fetch') ||
          !err.response) {
        console.log('Error de conexión detectado, redirigiendo...');
        setServerError(true);
        
        setTimeout(() => {
          navigate('/error/500_sing');
        }, 3000);
      } else {
        setMensaje('Error de conexión con el servidor.');
        setError(true);
      }
    }
  };

  if (serverError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 border border-gray-700 shadow-2xl p-8 rounded-2xl w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Error de Conexión</h2>
          <p className="text-gray-400 text-lg">Redirigiendo al manejo de errores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Efecto de fondo con gradiente animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            SMARTBOOKING
          </h1>
          <p className="text-gray-400 text-sm">Sistema de reserva de espacios compartidos</p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-6">
            <h2 className="text-2xl font-bold text-center text-white">
              {usuarioId ? 'Editar Cuenta' : 'Crear Cuenta'}
            </h2>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8">
            <div className="space-y-5">
              {/* Nombre completo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={usuarioId ? 'Dejar en blanco para no cambiar' : 'Crea una contraseña segura'}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  {...(!usuarioId && { required: true })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Tu dirección completa"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
              </div>

              {/* Teléfono y edad en la misma fila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Número de teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    placeholder="Tu edad"
                    value={formData.edad}
                    onChange={handleChange}
                    min="0"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  error 
                    ? 'bg-red-900/30 border-red-700 text-red-300' 
                    : 'bg-green-900/30 border-green-700 text-green-300'
                }`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {error ? (
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
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
          <p className="text-sm text-gray-400">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default UsuarioForm;