import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Typewriter } from 'react-simple-typewriter';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { isLoggedIn, userName, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav>
      <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
        {/* Desktop & Tablet Layout */}
        <div className="hidden lg:flex justify-between items-center gap-4">
          {/* Logo con contenedor de ancho fijo */}
          <div className="w-64 flex-shrink-0"> {/* Ancho fijo para evitar movimiento */}
            <Link to="/" className="flex items-center gap-3 animate-fadeIn">
              <div className="w-12 h-12 bg-[#3d3d3d] rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer flex-shrink-0">
                S
              </div>
              <div className="min-w-0 flex-1"> {/* Evita que el texto cause overflow */}
                <span className="text-3xl font-black text-[#3d3d3d] tracking-tight whitespace-nowrap">
                  <Typewriter
                    words={['SMARTBOOKING']}
                    loop={0}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={350}
                    delaySpeed={1000}
                  />
                </span>
              </div>
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <ul className="flex gap-6 list-none bg-white/70 px-8 py-3.5 rounded-full backdrop-blur-md shadow-lg mx-auto">
            <li>
              <Link 
                to="/" 
                className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                to="/Espacios" 
                className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5"
              >
                Espacios
              </Link>
            </li>
            <li>
              <Link 
                to="/Reservas" 
                className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5"
              >
                Mis Reservas
              </Link>
            </li>
            <li>
              <Link 
                to="/Contacto" 
                className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5"
              >
                Contacto
              </Link>
            </li>
          </ul>
          
          {/* Botones de autenticación Desktop */}
          <div className="flex gap-3 flex-shrink-0">
            {!isLoggedIn ? (
              // Mostrar cuando NO está logueado
              <>
                <Link to="/InciarSesion">
                  <button className="bg-white/80 text-[#3d3d3d] px-8 py-3.5 rounded-xl text-base font-bold hover:bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/Registrarse">
                  <button className="bg-[#4a4035] text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-[#352e25] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:scale-95">
                    Registrarse
                  </button>
                </Link>
              </>
            ) : (
              // Mostrar cuando SÍ está logueado
              <div className="flex gap-3 items-center">
                {/* Botón de Administración - Solo para admin */}
                {(localStorage.getItem('userEmail') === 'x@gmail.com' || userEmail === 'x@gmail.com') && (
                  <button
                    onClick={() => navigate('/panelAdmin')}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors duration-300 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex justify-between items-center">
            {/* Logo Mobile con ancho fijo */}
            <div className="w-48 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#3d3d3d] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0">
                  S
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl font-black text-[#3d3d3d] tracking-tight whitespace-nowrap">
                    <Typewriter
                      words={['SMARTBOOKING']}
                      loop={0}
                      cursor
                      cursorStyle="_"
                      typeSpeed={70}
                      deleteSpeed={350}
                      delaySpeed={1000}
                    />
                  </span>
                </div>
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-white/70 rounded-xl backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`absolute left-4 right-4 mt-4 z-[100] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="list-none p-4 space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2" 
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/Espacios" 
                  className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2" 
                  onClick={() => setMenuOpen(false)}
                >
                  Espacios
                </Link>
              </li>
              <li>
                <Link 
                  to="/Reservas" 
                  className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2" 
                  onClick={() => setMenuOpen(false)}
                >
                  Mis Reservas
                </Link>
              </li>
              <li>
                <Link 
                  to="/Contacto" 
                  className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2" 
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>
            </ul>

            {/* Sección de autenticación móvil */}
            <div className="p-4 border-t border-gray-200">
              {isLoggedIn ? (
                // Cuando está logueado - mostrar cerrar sesión y admin
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 font-medium">Hola, {userName}</p>
                    <p className="text-gray-400 text-sm">{userEmail}</p>
                  </div>
                  
                  {/* Botón de administración móvil */}
                  {(localStorage.getItem('userEmail') === 'x@gmail.com' || userEmail === 'x@gmail.com') && (
                    <button
                      onClick={() => {
                        navigate('/panelAdmin');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-center bg-purple-500 text-white font-bold px-6 py-3 rounded-lg text-base hover:bg-purple-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Administración
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-center bg-red-500 text-white font-bold px-6 py-3 rounded-lg text-base hover:bg-red-600 transition-all duration-300 active:scale-95"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                // Cuando NO está logueado - mostrar iniciar sesión y registrarse
                <div className="flex flex-col gap-3">
                  <Link to="/InciarSesion" onClick={() => setMenuOpen(false)}>
                    <button className="w-full bg-white/80 text-[#3d3d3d] px-6 py-3 rounded-xl text-base font-bold hover:bg-white transition-all duration-300 hover:shadow-lg">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link to="/Registrarse" onClick={() => setMenuOpen(false)}>
                    <button className="w-full bg-[#4a4035] text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-[#352e25] transition-all duration-300 hover:shadow-lg">
                      Registrarse
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Navbar);