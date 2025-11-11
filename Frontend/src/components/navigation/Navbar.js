import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Typewriter } from 'react-simple-typewriter';

function Navbar(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
    
    >
      <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
        {/* Desktop & Tablet Layout */}
        <div className="hidden lg:flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fadeIn">
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
          </div>
          
          {/* Menu */}
          <ul className="flex gap-6 list-none bg-white/70 px-8 py-3.5 rounded-full backdrop-blur-md shadow-lg">
            <li><a href="#home" className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5">Inicio</a></li>
            <li><a href="#spaces" className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5">Espacios</a></li>
            <li><a href="#reservations" className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5">Mis Reservas</a></li>
            <li><a href="#contact" className="text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 hover:scale-110 inline-block hover:-translate-y-0.5">Contacto</a></li>
          </ul>
          
          {/* Botones de autenticación */}
          <div className="flex gap-3">
            <button className="bg-white/80 text-[#3d3d3d] px-8 py-3.5 rounded-xl text-base font-bold hover:bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md">
              Iniciar Sesión
            </button>
            <button className="bg-[#4a4035] text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-[#352e25] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:scale-95">
              Registrarse
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex justify-between items-center">
            {/* Logo Mobile */}
            <div className="flex items-center gap-2">
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
            </div>

            {/* Hamburger Menu */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-white/70 rounded-xl backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#3d3d3d] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`absolute left-4 right-4 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="list-none p-4 space-y-3">
              <li><a href="#home" className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2">Inicio</a></li>
              <li><a href="#spaces" className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2">Espacios</a></li>
              <li><a href="#reservations" className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2">Mis Reservas</a></li>
              <li><a href="#contact" className="block text-base text-[#5d5d5d] font-semibold hover:text-[#3d3d3d] transition-all duration-300 py-2 hover:translate-x-2">Contacto</a></li>
            </ul>
            
            <div className="flex flex-col gap-3 p-4 border-t border-gray-200">
              <button className="w-full bg-white/80 text-[#3d3d3d] px-6 py-3 rounded-xl text-base font-bold hover:bg-white transition-all duration-300 hover:shadow-lg">
                Iniciar Sesión
              </button>
              <button className="w-full bg-[#4a4035] text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-[#352e25] transition-all duration-300 hover:shadow-lg">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Navbar);