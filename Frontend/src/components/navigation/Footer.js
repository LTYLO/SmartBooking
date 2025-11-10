import { connect } from 'react-redux';

function Footer(props) {
  return (
    <div className="relative z-20 bg-[#3d3d3d]/90 backdrop-blur-md text-white py-6 sm:py-8 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm md:text-base font-semibold">
            © 2025 SmartBooking - Sistema de Reserva de Espacios Compartidos
          </p>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Desarrollado por: Kevin Alexander Salinas Páez | Pedro Julian Tavera Cortez | Neiber Hernando Zipasuca Soto
          </p>
        </div>
        
        {/* Enlaces adicionales opcionales */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
          <a href="#privacy" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Política de Privacidad
          </a>
          <a href="#terms" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Términos de Uso
          </a>
          <a href="#contact" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Contacto
          </a>
          <a href="#help" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Ayuda
          </a>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Footer);