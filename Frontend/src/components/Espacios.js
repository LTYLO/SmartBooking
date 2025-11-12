import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, ChevronDown, User } from 'lucide-react';

// Configuración de datos
const SPACES = {
  'Sala de reuniones A': { colorClass: 'bg-yellow-500', hex: '#ffc107' },
  'Canchas de futbol': { colorClass: 'bg-green-600', hex: '#28a745' },
  'Auditorio principal': { colorClass: 'bg-orange-500', hex: '#fd7e14' },
  'Área de juegos': { colorClass: 'bg-blue-500', hex: '#007bff' }
};

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Datos de reservas
const ALL_RESERVATIONS = [
  { id: 1, date: '2025-01-05', space: 'Sala de reuniones A', user: 'user 1', time: '09:00-10:00' },
  { id: 2, date: '2025-01-05', space: 'Auditorio principal', user: 'user 2', time: '14:00-16:00' },
  { id: 3, date: '2025-03-15', space: 'Canchas de futbol', user: 'user 3', time: '18:00-20:00' },
  { id: 4, date: '2025-07-04', space: 'Área de juegos', user: 'user 4', time: '11:00-12:00' },
  { id: 5, date: '2025-09-10', space: 'Sala de reuniones A', user: 'user 5', time: '15:00-17:00' },
  { id: 801, date: '2025-11-09', space: 'Sala de reuniones A', user: 'user 1', time: '08:00-09:00' },
  { id: 802, date: '2025-11-09', space: 'Canchas de futbol', user: 'user 2', time: '09:00-10:00' },
  { id: 803, date: '2025-11-09', space: 'Auditorio principal', user: 'user 3', time: '10:00-11:00' },
  { id: 804, date: '2025-11-09', space: 'Área de juegos', user: 'user 4', time: '11:00-12:00' },
  { id: 805, date: '2025-11-09', space: 'Sala de reuniones A', user: 'user 5', time: '12:00-13:00' },
  { id: 806, date: '2025-11-09', space: 'Canchas de futbol', user: 'user 6', time: '13:00-14:00' },
  { id: 807, date: '2025-11-09', space: 'Auditorio principal', user: 'user 7', time: '14:00-15:00' },
  { id: 808, date: '2025-11-09', space: 'Área de juegos', user: 'user 8', time: '15:00-16:00' },
  { id: 809, date: '2025-11-09', space: 'Sala de reuniones A', user: 'user 9', time: '16:00-17:00' },
  { id: 810, date: '2025-11-09', space: 'Canchas de futbol', user: 'user 10', time: '17:00-18:00' },
  { id: 101, date: '2025-11-07', space: 'Auditorio principal', user: 'user 1', time: '10:00-12:00' },
  { id: 102, date: '2025-11-07', space: 'Área de juegos', user: 'user 3', time: '12:30-14:30' },
  { id: 201, date: '2025-11-08', space: 'Sala de reuniones A', user: 'user 2', time: '08:00-09:00' },
  { id: 202, date: '2025-11-08', space: 'Canchas de futbol', user: 'user 1', time: '09:00-10:00' },
  { id: 203, date: '2025-11-08', space: 'Sala de reuniones A', user: 'user 4', time: '10:00-11:00' },
  { id: 204, date: '2025-11-08', space: 'Área de juegos', user: 'user 3', time: '11:00-12:00' },
  { id: 205, date: '2025-11-08', space: 'Canchas de futbol', user: 'user 5', time: '12:00-13:00' },
  { id: 206, date: '2025-11-08', space: 'Auditorio principal', user: 'user 6', time: '13:00-14:00' },
  { id: 301, date: '2025-11-10', space: 'Área de juegos', user: 'user 1', time: '09:00-10:00' },
  { id: 302, date: '2025-11-10', space: 'Canchas de futbol', user: 'user 2', time: '10:00-11:00' },
  { id: 303, date: '2025-11-10', space: 'Sala de reuniones A', user: 'user 3', time: '11:00-12:00' },
  { id: 401, date: '2025-11-20', space: 'Auditorio principal', user: 'user 4', time: '14:00-16:00' },
  { id: 501, date: '2025-11-25', space: 'Área de juegos', user: 'user 5', time: '18:00-20:00' },
  { id: 601, date: '2025-11-29', space: 'Sala de reuniones A', user: 'user 6', time: '16:00-17:00' },
  { id: 701, date: '2025-12-01', space: 'Canchas de futbol', user: 'user 7', time: '10:00-12:00' },
  { id: 702, date: '2025-12-25', space: 'Área de juegos', user: 'user 8', time: '15:00-17:00' },
];

// Componente de Avatar
const UserAvatar = ({ userName }) => {
  const getUserAvatar = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    color = "00000".substring(0, 6 - color.length) + color;
    const initials = name.substring(0, 1).toUpperCase();
    return `https://placehold.co/32x32/${color}/ffffff?text=${initials}&font=Inter`;
  };

  return (
    <img 
      src={getUserAvatar(userName)} 
      alt={userName.substring(0, 1).toUpperCase()} 
      className="w-8 h-8 rounded-full border border-gray-200"
    />
  );
};

// Componente Modal
const ReservationModal = ({ reservation, onClose }) => {
  if (!reservation) return null;

  const spaceData = SPACES[reservation.space];
  
  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Detalles de la Reserva</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div 
            className="border-l-4 p-4 rounded-lg shadow-inner" 
            style={{ 
              borderLeftColor: spaceData.hex, 
              backgroundColor: `${spaceData.hex}15` 
            }}
          >
            <p className="text-sm font-medium text-gray-600">Espacio</p>
            <p className="text-xl font-semibold text-gray-800">{reservation.space}</p>
          </div>
          <div className="flex items-center space-x-4 border-b pb-2">
            <UserAvatar userName={reservation.user} />
            <div>
              <p className="text-sm font-medium text-gray-600">Reservado por</p>
              <p className="text-lg font-medium text-gray-800">{reservation.user}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Horario</p>
              <p className="text-lg font-medium text-gray-800">{reservation.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Fecha</p>
              <p className="text-lg font-medium text-gray-800">{reservation.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export default function ReservationSystem() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [currentFilter, setCurrentFilter] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    if (newDate.getFullYear() !== 2025) return;
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();
    if (today.getFullYear() !== 2025) {
      setCurrentDate(new Date(2025, 10, 1));
    } else {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
    setSelectedDate(null);
  };

  const getFilteredReservations = (dateStr) => {
    return ALL_RESERVATIONS
      .filter(res => res.date === dateStr)
      .filter(res => currentFilter === 'Todos' || res.space === currentFilter)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getDailyUsers = (dateStr) => {
    const dailyReservations = ALL_RESERVATIONS
      .filter(res => res.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));

    const usersMap = {};
    dailyReservations.forEach(res => {
      if (!usersMap[res.user]) {
        usersMap[res.user] = {
          user: res.user,
          reservations: []
        };
      }
      usersMap[res.user].reservations.push({
        space: res.space,
        time: res.time,
        hex: SPACES[res.space].hex
      });
    });

    return Object.values(usersMap);
  };

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().substring(0, 10);

    const days = [];
    
    // Días de relleno antes del 1
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-b border-r border-gray-200 bg-gray-50"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const dailyReservations = getFilteredReservations(dateStr);
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;

      days.push(
        <div
          key={dateStr}
          data-date={dateStr}
          onClick={() => setSelectedDate(dateStr)}
          className={`p-2 border-b border-r border-gray-200 transition-shadow hover:shadow-lg cursor-pointer min-h-[80px] ${
            isSelected ? 'bg-gray-100 shadow-inner ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
              isToday ? 'text-white bg-red-500 font-bold' : 'text-gray-700'
            }`}>
              {day}
            </span>
          </div>
          <div className="pt-1">
            {dailyReservations.length > 0 ? (
              dailyReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReservation(res);
                  }}
                  style={{ backgroundColor: SPACES[res.space].hex }}
                  className="w-full h-2 rounded-sm mb-0.5 cursor-pointer hover:scale-110 transition-transform"
                  title={`${res.user}: ${res.space} (${res.time})`}
                />
              ))
            ) : (
              <div className="h-2"></div>
            )}
          </div>
        </div>
      );
    }

    // Días de relleno al final
    while (days.length % 7 !== 0) {
      days.push(<div key={`empty-end-${days.length}`} className="p-2 border-b border-r border-gray-200 bg-gray-50"></div>);
    }

    return days;
  };

  const dailyUsers = selectedDate ? getDailyUsers(selectedDate) : [];

  // Función para obtener datos del clima en tiempo real
  const getWeatherData = async (date) => {
    if (!date) return;
    
    try {
      // Buscar información del clima para la fecha seleccionada
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { 
              role: "user", 
              content: `Proporciona un pronóstico del clima realista para Bucaramanga, Colombia para la fecha ${date}. Responde SOLO en formato JSON con esta estructura exacta (sin markdown, sin backticks):
{
  "temperature": "número entre 20-28",
  "condition": "descripción corta del clima",
  "feelsLike": "número entre 22-30",
  "description": "breve descripción del pronóstico",
  "wind": "velocidad en km/h",
  "humidity": "porcentaje",
  "visibility": "distancia en km",
  "pressure": "presión en mbar"
}`
            }
          ],
          tools: [
            {
              "type": "web_search_20250305",
              "name": "web_search"
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("");
      
      // Limpiar el texto de posibles backticks de markdown
      const cleanText = textContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const weatherData = JSON.parse(cleanText);
      
      setWeather(weatherData);
    } catch (error) {
      console.error("Error obteniendo clima:", error);
      // Mantener clima por defecto en caso de error
    }
  };

  // Estado para el clima
  const [weather, setWeather] = useState({
    temperature: "25",
    condition: "Muy Nublado",
    feelsLike: "28",
    description: "Se espera algo de llovizna. Temperatura máxima 27°.",
    wind: "11 km/h",
    humidity: "75%",
    visibility: "8 km",
    pressure: "1014 mbar"
  });

  // Actualizar clima cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      getWeatherData(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto shadow-xl rounded-2xl bg-white">
        
        {/* Sidebar Izquierda */}
        <div className="lg:w-1/4 p-6 bg-gray-50 rounded-l-2xl border-r border-gray-200">
          
          {/* Categorías */}
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-3 flex justify-between items-center cursor-pointer"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Categorías
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${categoriesOpen ? '' : 'rotate-180'}`} />
            </h2>
            {categoriesOpen && (
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentFilter('Todos')}
                  className={`w-full text-left p-2 rounded-lg transition ${
                    currentFilter === 'Todos' ? 'bg-blue-500 text-white font-semibold' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                {Object.entries(SPACES).map(([name, data]) => (
                  <button
                    key={name}
                    onClick={() => setCurrentFilter(name)}
                    style={{ borderColor: data.hex }}
                    className={`w-full text-left p-2 rounded-lg transition ${
                      currentFilter === name ? 'bg-gray-200 font-semibold border-l-4' : 'hover:bg-gray-100'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Usuarios del Día Seleccionado */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">
              {selectedDate ? `Reservas - Día ${selectedDate.substring(8, 10)}` : 'Usuarios del Día Seleccionado'}
            </h3>
            <div className="space-y-3">
              {!selectedDate ? (
                <p className="text-sm text-gray-500">Selecciona un día en el calendario para ver las reservas.</p>
              ) : dailyUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No hay reservas para el día seleccionado.</p>
              ) : (
                dailyUsers.map((userData) => (
                  <div key={userData.user} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition">
                    <UserAvatar userName={userData.user} />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{userData.user}</p>
                      <p className="text-xs text-gray-500">{userData.reservations.length} reserva(s) en total</p>
                    </div>
                    <div className="flex space-x-1 ml-auto">
                      {userData.reservations.map((res, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: res.hex }}
                          title={`${res.space} (${res.time})`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tiempo Actual */}
          <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">
              Tiempo {selectedDate ? `- ${selectedDate.substring(8, 10)}/${selectedDate.substring(5, 7)}/${selectedDate.substring(0, 4)}` : 'Actual'}
            </h3>
            <div className="flex items-center space-x-4">
              <p className="text-5xl font-light text-blue-600">{weather.temperature}°C</p>
              <div>
                <p className="font-semibold text-gray-700">{weather.condition}</p>
                <p className="text-sm text-gray-500">Sensación térmica: {weather.feelsLike}°</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{weather.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-4">
              <div><span className="font-medium">Viento:</span> {weather.wind}</div>
              <div><span className="font-medium">Humedad:</span> {weather.humidity}</div>
              <div><span className="font-medium">Visibilidad:</span> {weather.visibility}</div>
              <div><span className="font-medium">Presión:</span> {weather.pressure}</div>
            </div>
            {selectedDate && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  ℹ️ Pronóstico actualizado para la fecha seleccionada
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Calendario Principal */}
        <div className="lg:w-3/4 p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          
          {/* Controles del Calendario */}
          <div className="flex justify-end items-center mb-6 space-x-2">
            <button 
              onClick={() => changeMonth(-1)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition"
            >
              Previous
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Today
            </button>
            <button 
              onClick={() => changeMonth(1)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>

          {/* Grid del Calendario */}
          <div className="grid grid-cols-7 border-t border-l border-gray-200">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-600 border-b border-r border-gray-200">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Leyenda de Colores */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Leyenda de Espacios</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(SPACES).map(([name, data]) => (
                <div key={name} className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: data.hex }}></span>
                  <span className="text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReservation && (
        <ReservationModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)} 
        />
      )}
    </div>
  );
}