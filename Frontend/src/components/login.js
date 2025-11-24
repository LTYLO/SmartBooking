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
      const response = await fetch('http://localhost:8000/api/users/token/', {
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
  };

  const handleAdminAccess = () => {
    navigate('/admin-panel');
  };

  const isAdmin = isLoggedIn && userEmail === 'x@gmail.com';

  if (serverError) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Fondo con imagen y blur */}
        <div 
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url(${logo2})`,
            filter: 'blur(3px)',
            transform: 'scale(1.02)'
          }}
        />
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
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${logo2})`,
          filter: 'blur(3px)',
          transform: 'scale(1.02)'
        }}
      />
      <div className="fixed inset-0 -z-10 bg-white/30" />

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
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            SMARTBOOKING
          </h1>
          <p className="text-[#4a4035] text-sm font-semibold">Sistema de reserva de espacios compartidos</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#3d3d3d]">
            {isLoggedIn ? '¡Bienvenido!' : 'Iniciar Sesión'}
          </h2>

          {!isLoggedIn ? (
            <form onSubmit={handleLogin}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[#5d5d5d] text-sm font-bold mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#5d5d5d] text-sm font-bold mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 border-2 border-[#e5e5e5] rounded-xl text-[#3d3d3d] placeholder-[#9d9d9d] focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-300 disabled:bg-[#f5f0ea] disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c9b39c] hover:bg-[#b8a28b] disabled:bg-[#d4c4b0] text-white font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed disabled:transform-none"
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

              <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                <p className="text-center text-sm text-[#6d6d6d]">
                  ¿No tienes una cuenta?{' '}
                  <NavLink
                    to="/registrarse"
                    className="text-[#c9b39c] hover:text-[#b8a28b] font-bold transition-colors duration-300"
                  >
                    Regístrate aquí
                  </NavLink>
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#f5f0ea] to-[#ebe3d8] border border-[#e5e5e5] rounded-xl">
                <p className="text-[#3d3d3d] font-bold text-lg">Sesión activa</p>
                <p className="text-[#c9b39c] mt-1 font-medium">{userName}</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-[#f5f0ea] hover:bg-[#ebe3d8] text-[#3d3d3d] font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 active:scale-95"
                >
                  Cerrar sesión
                </button>

                <NavLink
                  to="/"
                  className="block w-full bg-[#c9b39c] hover:bg-[#b8a28b] text-white font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:scale-95 text-center shadow-lg hover:shadow-2xl"
                >
                  Ir al inicio
                </NavLink>
              </div>
            </div>
          )}

          {mensaje && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium border-2 transition-all duration-300 ${
                mensaje.toLowerCase().includes('error')
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-green-50 border-green-200 text-green-600'
              }`}
            >
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;