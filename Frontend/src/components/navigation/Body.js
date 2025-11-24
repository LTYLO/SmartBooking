import { connect } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente Calendario Personalizado
const CustomDatePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value));
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (date) => {
    if (date) {
      onChange(formatDate(date));
      setIsOpen(false);
    }
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const isSelected = (date) => {
    if (!date) return false;
    return formatDate(date) === value;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="relative" ref={calendarRef}>
      <div className="flex flex-col gap-2 group">
        <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg text-left flex items-center justify-between"
        >
          <span>{formatDisplayDate(value)}</span>
          <svg className="w-5 h-5 text-[#c9b39c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#e5e5e5] min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-[#f5f0ea] rounded-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-[#c9b39c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="font-bold text-[#3d3d3d] text-base">
                {monthNames[currentMonth.getMonth()]}
              </div>
              <div className="text-sm text-[#6d6d6d]">
                {currentMonth.getFullYear()}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-[#f5f0ea] rounded-lg transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5 text-[#c9b39c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-bold text-[#6d6d6d] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const selected = isSelected(date);
              const today = isToday(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-300 font-medium
                    ${selected 
                      ? 'bg-[#c9b39c] text-white shadow-lg scale-110' 
                      : today
                      ? 'bg-[#f5f0ea] text-[#c9b39c] font-bold'
                      : 'hover:bg-[#f5f0ea] text-[#3d3d3d]'
                    }
                    hover:scale-110 active:scale-95
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                onChange(formatDate(new Date()));
                setIsOpen(false);
              }}
              className="text-xs text-[#c9b39c] font-bold hover:text-[#b8a28b] transition-colors duration-300"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs px-4 py-2 bg-[#f5f0ea] text-[#3d3d3d] rounded-lg font-bold hover:bg-[#ebe3d8] transition-all duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Selector de Tiempo Personalizado
const CustomTimePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const [selectedHour, selectedMinute] = value.split(':');

  const handleTimeSelect = (hour, minute) => {
    onChange(`${hour}:${minute}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div className="flex flex-col gap-2 group">
        <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg text-left flex items-center justify-between"
        >
          <span>{value}</span>
          <svg className="w-5 h-5 text-[#c9b39c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#e5e5e5] min-w-[280px]">
          <div className="text-center mb-4">
            <div className="font-bold text-[#3d3d3d] text-base">Seleccionar Hora</div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <div className="text-xs font-bold text-[#6d6d6d] mb-2 text-center">Hora</div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {hours.map(hour => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeSelect(hour, selectedMinute)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${hour === selectedHour 
                        ? 'bg-[#c9b39c] text-white shadow-lg' 
                        : 'hover:bg-[#f5f0ea] text-[#3d3d3d]'
                      }
                    `}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold text-[#6d6d6d] mb-2 text-center">Min</div>
              <div className="space-y-1">
                {minutes.map(minute => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeSelect(selectedHour, minute)}
                    className={`w-full p-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${minute === selectedMinute 
                        ? 'bg-[#c9b39c] text-white shadow-lg' 
                        : 'hover:bg-[#f5f0ea] text-[#3d3d3d]'
                      }
                    `}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs px-4 py-2 bg-[#f5f0ea] text-[#3d3d3d] rounded-lg font-bold hover:bg-[#ebe3d8] transition-all duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Selector Personalizado
const CustomSelect = ({ value, onChange, label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <div className="flex flex-col gap-2 group">
        <label className="text-xs sm:text-sm text-[#5d5d5d] font-bold text-left tracking-wide group-hover:text-[#c9b39c] transition-colors duration-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 sm:p-3.5 md:p-4 border-2 border-[#e5e5e5] rounded-xl text-sm sm:text-base text-[#3d3d3d] bg-white/80 focus:outline-none focus:border-[#c9b39c] focus:ring-4 focus:ring-[#c9b39c]/20 transition-all duration-500 font-medium hover:border-[#c9b39c]/50 hover:shadow-lg text-left flex items-center justify-between"
        >
          <span>{selectedOption?.label}</span>
          <svg className={`w-5 h-5 text-[#c9b39c] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded-2xl shadow-2xl p-2 border-2 border-[#e5e5e5] min-w-full">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full p-3 rounded-lg text-sm font-medium transition-all duration-300 text-left
                ${option.value === value 
                  ? 'bg-[#c9b39c] text-white shadow-lg' 
                  : 'hover:bg-[#f5f0ea] text-[#3d3d3d]'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SpaceCard = ({ title, type, capacity, index, onReserve }) => {
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
        <button 
          onClick={onReserve}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-[#c9b39c] text-white rounded-lg font-bold hover:bg-[#b8a28b] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm sm:text-base">
          Reservar Ahora
        </button>
      </div>
    </div>
  );
};

function Body(props) {
  const navigate = useNavigate();
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

  const spaceOptions = [
    { value: 'sala', label: 'Sala de reuniones' },
    { value: 'auditorio', label: 'Auditorio' },
    { value: 'cancha', label: 'Cancha deportiva' },
    { value: 'recreativa', label: 'Área recreativa' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Imagen de fondo con overlay */}
      <div 
       className="fixed inset-0 -z-10 bg-cover ...">
       
      </div>

      {/* Hero Content */}
      <div className={`relative z-10 text-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
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
        <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-14 lg:mb-16 shadow-2xl backdrop-blur-md border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#3d3d3d] mb-4 sm:mb-6 text-left">
            Consultar Disponibilidad de Espacios
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-5 sm:mb-6 md:mb-8">
            <CustomDatePicker 
              value={startDate}
              onChange={setStartDate}
              label="Fecha Inicio"
            />
            
            <CustomDatePicker 
              value={endDate}
              onChange={setEndDate}
              label="Fecha Fin"
            />
            
            <CustomTimePicker 
              value={startTime}
              onChange={setStartTime}
              label="Hora Inicio"
            />
            
            <CustomTimePicker 
              value={endTime}
              onChange={setEndTime}
              label="Hora Fin"
            />
            
            <CustomSelect 
              value={spaceType}
              onChange={setSpaceType}
              label="Tipo de Espacio"
              options={spaceOptions}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/Espacios')}
              className="w-full sm:w-auto bg-[#c9b39c] text-white px-8 sm:px-12 md:px-16 py-3 sm:py-3.5 md:py-4 rounded-xl font-black text-sm sm:text-base md:text-lg hover:bg-[#b8a28b] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10">Buscar Espacios Disponibles</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8a28b] to-[#a38968] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            
            <button 
              onClick={() => navigate('/Reservas')}
              className="w-full sm:w-auto bg-white/80 text-[#3d3d3d] px-8 sm:px-12 md:px-16 py-3 sm:py-3.5 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 backdrop-blur-md">
              Ver Mis Reservas
            </button>
          </div>
          
          <p className="text-xs sm:text-sm text-[#6d6d6d] mt-4 text-center">
            Campos obligatorios | Sistema validará disponibilidad en tiempo real
          </p>
        </div>
      </div>

      {/* Espacios Disponibles */}
      <div className="relative z-[1] px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3d3d3d] mb-6 sm:mb-8 text-center drop-shadow-lg">
          Espacios Disponibles
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          <SpaceCard title="Sala de Reuniones A" type="sala" capacity="15 personas" index={0} onReserve={() => navigate('/Espacios')} />
          <SpaceCard title="Auditorio Principal" type="auditorio" capacity="200 personas" index={1} onReserve={() => navigate('/Espacios')} />
          <SpaceCard title="Cancha de Fútbol" type="cancha" capacity="22 jugadores" index={2} onReserve={() => navigate('/Espacios')} />
          <SpaceCard title="Área de Juegos" type="recreativa" capacity="30 personas" index={3} onReserve={() => navigate('/Espacios')} />
        </div>
      </div>

      {/* Características del Sistema */}
      <div className="relative z-[1] px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-7xl mx-auto">
        <div className="bg-white/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
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