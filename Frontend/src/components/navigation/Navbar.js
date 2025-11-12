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
// luego quitar
  const [showCart, setShowCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { isLoggedIn, userName, userEmail, logout } = useAuth();
  const navigate = useNavigate();
// hasta aqui
  const handleLogout = () => {
    logout();
    navigate('/Home');
  };
//y aqyu
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Items del menú principal (filtrados según el estado de login)
  const getMenuItems = () => {
    const baseItems = [
      { to: "/Home", label: "Inicio" },
    ];

    // Solo mostrar "Crear cuenta" si NO está logueado
    if (!isLoggedIn) {
      baseItems.push({ to: "/registrarse", label: "Crear cuenta" });
    }

    return baseItems;
  };


  return (
    <nav>
      <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
        {/* Desktop & Tablet Layout */}
        <div className="hidden lg:flex justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 animate-fadeIn">
            <div className="w-12 h-12 bg-[#3d3d3d] rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer">
              S
            </div>
            <span className="text-3xl font-black text-[#3d3d3d] tracking-tight">
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
          </Link>
          
          {/* Menu Desktop */}
          <ul className="flex gap-6 list-none bg-white/70 px-8 py-3.5 rounded-full backdrop-blur-md shadow-lg">
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
          <div className="flex gap-3">
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
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex justify-between items-center">
            {/* Logo Mobile */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#3d3d3d] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                S
              </div>
              <span className="text-xl sm:text-2xl font-black text-[#3d3d3d] tracking-tight">
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
            </Link>

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-white/70 rounded-xl backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300"
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
            

            {/* Botón de login/logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="
                  bg-red-500 text-white px-3 py-1 rounded 
                  hover:bg-red-600 hover:scale-105 transition-all duration-300 
                  text-[16px] font-bold ml-2 shadow-md hover:shadow-lg
                "
              >
                Cerrar sesión
              </button>
            ) : (
              <NavLink
                to="/login"
                className="
                    group relative overflow-hidden
                    bg-white/90 backdrop-blur-sm
                    text-emerald-700 font-semibold text-[16px]
                    px-4 py-2 ml-2 rounded-lg
                    border border-emerald-200/50
                    hover:bg-emerald-600 hover:text-white
                    hover:border-emerald-600
                    hover:shadow-lg hover:shadow-emerald-200/40
                    hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-emerald-300/50 focus:ring-offset-1
                    active:translate-y-0 active:scale-[0.98]
                    transition-all duration-300 ease-out
                    before:absolute before:inset-0 
                    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                    before:translate-x-[-100%] before:transition-transform before:duration-500
                    hover:before:translate-x-[100%]
                  "
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Ingresa
                </span>
              </NavLink>
            )}
            {/* Botón de Administración - Solo para admin logueado */}
            {isLoggedIn && (localStorage.getItem('userEmail') === 'x@gmail.com' || userEmail === 'x@gmail.com') && (
              <button
                onClick={() => navigate('/admin-panel')}
                className="
                            bg-purple-500 text-white px-3 py-1 rounded 
                            hover:bg-purple-600 hover:scale-105 transition-all duration-300 
                            text-[16px] font-bold ml-2 shadow-md hover:shadow-lg
                            flex items-center gap-1
                          "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </button>
            )}
            {/* Botón de login/logout destacado */}
                <div className="mt-4 pt-4 border-t border-green-300/20">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="
                        block w-full text-center
                        bg-red-500 text-white font-bold
                        px-6 py-4 rounded-lg text-base sm:text-lg
                        hover:bg-red-600 hover:shadow-lg
                        transition-all duration-300
                        active:scale-95
                      "
                    >
                      Cerrar sesión
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="
                                  group relative block w-full text-center overflow-hidden
                                  bg-gradient-to-r from-emerald-50 to-green-50
                                  border border-emerald-200/60
                                  text-emerald-700 font-semibold
                                  px-6 py-4 rounded-xl text-base sm:text-lg
                                  backdrop-blur-sm
                                  hover:from-emerald-100 hover:to-green-100
                                  hover:border-emerald-300/80
                                  hover:shadow-lg hover:shadow-emerald-100/50
                                  hover:text-emerald-800
                                  hover:-translate-y-0.5
                                  focus:outline-none focus:ring-2 focus:ring-emerald-300/50 focus:ring-offset-2
                                  active:translate-y-0 active:scale-[0.98]
                                  transition-all duration-300 ease-in-out
                                  before:absolute before:inset-0 
                                  before:bg-gradient-to-r before:from-emerald-200/0 before:via-emerald-200/20 before:to-emerald-200/0
                                  before:translate-x-[-100%] before:transition-transform before:duration-700
                                  hover:before:translate-x-[100%]
                                "
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Ingresar
                      </span>
                    </NavLink>
                  )}
                </div>
                {/* Botón de administración móvil */}
                {isLoggedIn && (localStorage.getItem('userEmail') === 'x@gmail.com' || userEmail === 'x@gmail.com') && (
                  <button
                    onClick={() => {
                      navigate('/admin-panel');
                      setIsOpen(false);
                    }}
                    className="
                                block w-full text-center mt-2
                                bg-purple-500 text-white font-bold
                                px-6 py-4 rounded-lg text-base sm:text-lg
                                hover:bg-purple-600 hover:shadow-lg
                                transition-all duration-300
                                active:scale-95
                                flex items-center justify-center gap-2
                              "
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Administración
                  </button>
                )}



            {/* Botones de autenticación Mobile */}
            <div className="flex flex-col gap-3 p-4 border-t border-gray-200">
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
          </div>
        </div>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Navbar);