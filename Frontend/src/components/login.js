import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo2 from 'assets/img/background.jpg';

const LoginForm = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName, login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        let finalUserName = 'Usuario';

        try {
          const userResponse = await fetch('http://localhost:8000/api/users/', {
            headers: {
              Authorization: `Bearer ${data.access}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            finalUserName = userData.nombre || userData.name || 'Usuario';
          } else {
            console.warn('No se pudo obtener el nombre de usuario');
          }
        } catch (userError) {
          console.warn('Error al obtener datos del usuario:', userError);
        }

        setUserEmail(email);
        login(data.access, finalUserName, email);
        setMensaje('Sesión iniciada correctamente');

        setTimeout(() => {
          navigate('/Home');
        }, 1500);
      } else {
        setMensaje(data.detail || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      if (
        err.code === 'ECONNREFUSED' ||
        err.code === 'ERR_NETWORK' ||
        err.message.includes('Network Error') ||
        err.message.includes('fetch') ||
        !err.response
      ) {
        console.log('Error de conexión detectado, redirigiendo...');
        setServerError(true);
        setTimeout(() => {
          navigate('/error/500_login');
        }, 3000);
      } else {
        setMensaje('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserEmail('');
    setMensaje('Sesión cerrada');
    setTimeout(() => {
      navigate('/Home');
    }, 1000);
  };

  const handleAdminAccess = () => {
    navigate('/admin-panel');
  };

  const isAdmin = isLoggedIn && userEmail === 'x@gmail.com';

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
      <div className="relative z-10 w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
            <img
              src={logo2}
              alt="Logo"
              className="w-10 h-10 object-contain filter brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            SMARTBOOKING
          </h1>
          <p className="text-gray-400 text-sm">Sistema de reserva de espacios compartidos</p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            {isLoggedIn ? '¡Bienvenido!' : 'Iniciar Sesión'}
          </h2>

          {!isLoggedIn ? (
            <form onSubmit={handleLogin}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-center text-sm text-gray-400">
                  ¿No tienes una cuenta?{' '}
                  <NavLink
                    to="/registrarse"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                  >
                    Regístrate aquí
                  </NavLink>
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 rounded-xl">
                <p className="text-gray-100 font-bold text-lg">Sesión activa</p>
                <p className="text-purple-300 mt-1 font-medium">{userName}</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Cerrar sesión
                </button>

                <NavLink
                  to="/Home"
                  className="block w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-center shadow-lg hover:shadow-purple-500/50"
                >
                  Ir al inicio
                </NavLink>
              </div>
            </div>
          )}

          {mensaje && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium border transition-all duration-300 ${
                mensaje.toLowerCase().includes('error')
                  ? 'bg-red-900/30 border-red-700 text-red-300'
                  : 'bg-green-900/30 border-green-700 text-green-300'
              }`}
            >
              {mensaje}
            </div>
          )}
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

export default LoginForm;