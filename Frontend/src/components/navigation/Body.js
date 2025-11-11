import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

const SpaceCard = ({ title, type, capacity, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const getIcon = (type) => {
    switch(type) {
      case 'sala': return 'S';
      case 'auditorio': return 'A';
      case 'cancha': return 'C';
      case 'recreativa': return 'R';
      default: return 'E';
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-gradient-to-br from-[#f5f0ea]/95 to-[#ebe3d8]/95 rounded-2xl overflow-hidden shadow-xl transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl cursor-pointer transform backdrop-blur-sm ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
    >
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-[#d4c4b0] via-[#c9b39c] to-[#b8a28b] overflow-hidden flex items-center justify-center">
        <div className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/80 transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}`}>
          {getIcon(type)}
        </div>
        
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
          Disponible
        </div>
        
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
          <p className="text-xs sm:text-sm font-semibold text-[#3d3d3d]">Capacidad: {capacity}</p>
        </div>
      </div>
      
      <div className="p-4 sm:p-5 md:p-6 text-center bg-gradient-to-br from-[#f5f0ea]/95 to-[#ebe3d8]/95 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#3d3d3d] tracking-wide mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-[#6d6d6d] mb-3 sm:mb-4">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <button className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-[#c9b39c] text-white rounded-lg font-bold hover:bg-[#b8a28b] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm sm:text-base">
          Reservar Ahora
        </button>
      </div>
    </div>
  );
};

function Body(props) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [spaceType, setSpaceType] = useState('sala');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = () => {
    const searchData = {
      fechaInicio: startDate,
      fechaFin: endDate,
      horaInicio: startTime,
      horaFin: endTime,
      tipoEspacio: spaceType
    };
    
    alert(`Buscando espacios disponibles:\n\nFecha: ${startDate} - ${endDate}\nHorario: ${startTime} - ${endTime}\nTipo: ${spaceType}`);
    console.log('Búsqueda de disponibilidad:', searchData);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Content */}
      <div className={`relative z-20 text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {/* Título con Gradiente Animado */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-wider leading-none mb-4 sm:mb-9 uppercase drop-shadow-2xl animate-pulse" 
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.05em',
            }}>
          SMARTBOOKING
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#4a4035] max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-relaxed px-4 font-semibold drop-shadow-md">
          Sistema de reserva de espacios compartidos - Gestiona salas de reuniones, auditorios, canchas deportivas y áreas recreativas de forma eficiente
        </p>

        {/* Search Container */}
        <div className="bg-white/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-14 lg:mb-16 shadow-2xl backdrop-blur-md border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#3d3d3d] mb-4 sm:mb-6 text-left">
            Consultar Disponibilidad de Espacios
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-5 sm:mb-6 md:mb-8">
            <div className="flex flex-col gap-2 group">
              <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
                Fecha Inicio
              </label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2 group">
              <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
                Fecha Fin
              </label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2 group">
              <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
                Hora Inicio
              </label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2 group">
              <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
                Hora Fin
              </label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2 group">
              <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
                Tipo de Espacio
              </label>
              <select 
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                required
                className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg cursor-pointer"
              >
                <option value="sala">Sala de reuniones</option>
                <option value="auditorio">Auditorio</option>
                <option value="cancha">Cancha deportiva</option>
                <option value="recreativa">Área recreativa</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button 
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#c9b39c] text-white px-8 sm:px-12 md:px-16 py-3 sm:py-3.5 md:py-4 rounded-xl font-black text-sm sm:text-base md:text-lg hover:bg-[#b8a28b] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Buscar Espacios Disponibles</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8a28b] to-[#a38968] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            <button className="w-full sm:w-auto bg-white/80 text-[#3d3d3d] px-8 sm:px-12 md:px-16 py-3 sm:py-3.5 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md">
              Ver Mis Reservas
            </button>
          </div>
          
          <p className="text-xs sm:text-sm text-[#6d6d6d] mt-4 text-center">
            Campos obligatorios | Sistema validará disponibilidad en tiempo real
          </p>
        </div>
      </div>

      {/* Espacios Disponibles */}
      <div className="relative z-20 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3d3d3d] mb-6 sm:mb-8 text-center drop-shadow-lg">
          Espacios Disponibles
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          <SpaceCard title="Sala de Reuniones A" type="sala" capacity="15 personas" index={0} />
          <SpaceCard title="Auditorio Principal" type="auditorio" capacity="200 personas" index={1} />
          <SpaceCard title="Cancha de Fútbol" type="cancha" capacity="22 jugadores" index={2} />
          <SpaceCard title="Área de Juegos" type="recreativa" capacity="30 personas" index={3} />
        </div>
      </div>

      {/* Características del Sistema */}
      <div className="relative z-20 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-7xl mx-auto">
        <div className="bg-white/85 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3d3d3d] mb-6 sm:mb-8 text-center">
            Características del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <div className="text-center p-5 sm:p-6 bg-gradient-to-br from-[#f5f0ea] to-[#ebe3d8] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-black text-[#c9b39c] mb-3 sm:mb-4">RÁPIDO</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3d3d3d] mb-2">Eficiente</h3>
              <p className="text-xs sm:text-sm text-[#6d6d6d]">Respuesta en menos de 3 segundos. Sistema optimizado para 100+ usuarios concurrentes.</p>
            </div>
            
            <div className="text-center p-5 sm:p-6 bg-gradient-to-br from-[#f5f0ea] to-[#ebe3d8] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-black text-[#c9b39c] mb-3 sm:mb-4">SEGURO</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3d3d3d] mb-2">Protegido</h3>
              <p className="text-xs sm:text-sm text-[#6d6d6d]">Cifrado de datos sensibles y autenticación de doble factor implementada.</p>
            </div>
            
            <div className="text-center p-5 sm:p-6 bg-gradient-to-br from-[#f5f0ea] to-[#ebe3d8] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-black text-[#c9b39c] mb-3 sm:mb-4">99%</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3d3d3d] mb-2">Confiable</h3>
              <p className="text-xs sm:text-sm text-[#6d6d6d]">Disponibilidad ≥99% y recuperación en menos de 10 minutos tras fallo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Body);