import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, ChevronDown, User, Plus, AlertCircle, Check } from 'lucide-react';
import { useAuth } from 'components/AuthContext';

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];



// Componente de Avatar
const UserAvatar = ({ userName }) => {
  const getUserAvatar = (name) => {
    if (!name) return 'https://placehold.co/32x32/cccccc/ffffff?text=?&font=Inter';
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
      alt={userName?.substring(0, 1).toUpperCase() || '?'} 
      className="w-8 h-8 rounded-full border border-gray-200"
    />
  );
};


// Modal de detalles de reserva
const ReservationModal = ({ reservation, onClose, onCancel, isLoggedIn, userEmail }) => {
  if (!reservation) return null;

  const canCancel = isLoggedIn && 
    (reservation.estado === 'pendiente' || reservation.estado === 'confirmada') &&
    reservation.usuario_email === userEmail;
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Detalles de la Reserva</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div 
            className="border-l-4 p-4 rounded-lg shadow-inner" 
            style={{ 
              borderLeftColor: reservation.espacio_color, 
              backgroundColor: `${reservation.espacio_color}15` 
            }}
          >
            <p className="text-sm font-medium text-gray-600">Espacio</p>
            <p className="text-xl font-semibold text-gray-800">{reservation.espacio_nombre}</p>
          </div>
          
          <div className="flex items-center space-x-4 border-b pb-2">
            <UserAvatar userName={reservation.usuario_nombre} />
            <div>
              <p className="text-sm font-medium text-gray-600">Reservado por</p>
              <p className="text-lg font-medium text-gray-800">{reservation.usuario_nombre}</p>
              <p className="text-xs text-gray-500">{reservation.usuario_email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Horario</p>
              <p className="text-lg font-medium text-gray-800">
                {reservation.hora_inicio} - {reservation.hora_fin}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Fecha</p>
              <p className="text-lg font-medium text-gray-800">{reservation.fecha}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                reservation.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                reservation.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                reservation.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reservation.estado_display}
              </span>
            </div>
          </div>

          {reservation.numero_personas && (
            <div className="flex items-center space-x-4">
              <User className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Número de personas</p>
                <p className="text-lg font-medium text-gray-800">{reservation.numero_personas}</p>
              </div>
            </div>
          )}

          {reservation.motivo && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-gray-600">Motivo</p>
              <p className="text-sm text-gray-800">{reservation.motivo}</p>
            </div>
          )}

          {canCancel && onCancel && (
            <div className="pt-4 border-t">
              <button
                onClick={() => onCancel(reservation.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition"
              >
                Cancelar Reserva
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal para crear nueva reserva
const CreateReservationModal = ({ onClose, onSubmit, espacios, selectedDate }) => {
  const [formData, setFormData] = useState({
    espacio: '',
    fecha: selectedDate || new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
    numero_personas: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Nueva Reserva</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <Check className="w-5 h-5 mr-2" />
            ¡Reserva creada exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Espacio *
            </label>
            <select
              value={formData.espacio}
              onChange={(e) => setFormData({...formData, espacio: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un espacio</option>
              {espacios.filter(e => e.activo).map(espacio => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre} - {espacio.tipo_display} (Cap: {espacio.capacidad})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora inicio *
              </label>
              <input
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora fin *
              </label>
              <input
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de personas
            </label>
            <input
              type="number"
              value={formData.numero_personas}
              onChange={(e) => setFormData({...formData, numero_personas: e.target.value})}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({...formData, motivo: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el motivo de tu reserva..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? 'Creando...' : success ? '¡Creada!' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Principal
export default function ReservationSystem() {
  const API_BASE_URL = 'http://localhost:8000/api';
const { token, isLoggedIn, userName, userEmail } = useAuth();
  console.log('Token:', token);
console.log('isLoggedIn:', isLoggedIn);
console.log('userName:', userName);
console.log('userEmail:', userEmail);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentFilter, setCurrentFilter] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  
  // Estados de autenticación

  
  // Estados para datos del backend
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({
    temperature: "25",
    condition: "Parcialmente Nublado",
    feelsLike: "27",
    description: "Clima agradable con posibilidad de lluvia en la tarde.",
    wind: "10 km/h",
    humidity: "70%",
    visibility: "10 km",
    pressure: "1013 mbar"
  });

  // Funciones de autenticación
  


  // Cargar espacios
  useEffect(() => {
    fetchEspacios();
  }, []);

  // Cargar reservas del mes actual
  useEffect(() => {
    fetchReservas();
  }, [currentDate]);

  // Actualizar clima cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      getWeatherData(selectedDate);
    }
  }, [selectedDate]);

  const fetchEspacios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/espacios/`);
      const data = await response.json();
      setEspacios(data);
    } catch (error) {
      console.error('Error al cargar espacios:', error);
    }
  };

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
      const lastDayStr = `${year}-${month}-${String(lastDay.getDate()).padStart(2, '0')}`;

      const response = await fetch(
        `${API_BASE_URL}/reservas/reservas/?fecha_inicio=${firstDay}&fecha_fin=${lastDayStr}`
      );
      
      const data = await response.json();
      setReservas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (formData) => {
    if (!token) {
      throw new Error('Debes iniciar sesión para crear una reserva');
    }
    
    console.log('Enviando token:', token);
    const response = await fetch(`${API_BASE_URL}/reservas/reservas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.non_field_errors?.[0] || error.detail || error.error || 'Error al crear la reserva';
      throw new Error(errorMsg);
    }

    await fetchReservas();
    return await response.json();
  };

  const cancelReservation = async (reservaId) => {
    if (!token) {
      alert('Debes iniciar sesión');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reservas/reservas/${reservaId}/cancelar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchReservas();
        setSelectedReservation(null);
        alert('Reserva cancelada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al cancelar la reserva');
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva');
    }
  };

  const getWeatherData = async (date) => {
    if (!date) return;
    
    try {
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
      
      const cleanText = textContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const weatherData = JSON.parse(cleanText);
      
      setWeather(weatherData);
    } catch (error) {
      console.error("Error obteniendo clima:", error);
    }
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const getFilteredReservations = (dateStr) => {
    return reservas
      .filter(res => res.fecha === dateStr)
      .filter(res => currentFilter === 'Todos' || res.espacio_nombre === currentFilter)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  };

  const getDailyUsers = (dateStr) => {
    const dailyReservations = reservas
      .filter(res => res.fecha === dateStr)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

    const usersMap = {};
    dailyReservations.forEach(res => {
      if (!usersMap[res.usuario_nombre]) {
        usersMap[res.usuario_nombre] = {
          user: res.usuario_nombre,
          reservations: []
        };
      }
      usersMap[res.usuario_nombre].reservations.push({
        space: res.espacio_nombre,
        time: `${res.hora_inicio}-${res.hora_fin}`,
        hex: res.espacio_color
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
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-b border-r border-gray-200 bg-gray-50"></div>);
    }

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
                  style={{ backgroundColor: res.espacio_color }}
                  className="w-full h-2 rounded-sm mb-0.5 cursor-pointer hover:scale-110 transition-transform"
                  title={`${res.usuario_nombre}: ${res.espacio_nombre} (${res.hora_inicio}-${res.hora_fin})`}
                />
              ))
            ) : (
              <div className="h-2"></div>
            )}
          </div>
        </div>
      );
    }

    while (days.length % 7 !== 0) {
      days.push(<div key={`empty-end-${days.length}`} className="p-2 border-b border-r border-gray-200 bg-gray-50"></div>);
    }

    return days;
  };

  const dailyUsers = selectedDate ? getDailyUsers(selectedDate) : [];

  const handleNewReservation = () => {
  if (!isLoggedIn) {
    alert('Debes iniciar sesión para crear una reserva');
    window.location.href = '/InciarSesion'; // o usa navigate('/InciarSesion')
  } else {
    setShowCreateModal(true);
  }
};
  if (loading && espacios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto shadow-xl rounded-2xl bg-white">
        
        {/* Sidebar Izquierda */}
        <div className="lg:w-1/4 p-6 bg-gray-50 rounded-l-2xl border-r border-gray-200">
          
          {/* Botones de Autenticación */}
          {/* Usuario autenticado */}
<div className="mb-6">
  {isLoggedIn ? (
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
        <UserAvatar userName={userName} />
        <div>
          <p className="font-medium text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-800 text-center">
        Inicia sesión para crear reservas
      </p>
    </div>
  )}
</div>

          {/* Botón Crear Reserva */}
          {isLoggedIn && (
            <button
              onClick={handleNewReservation}
              className="w-full mb-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Reserva</span>
            </button>
          )}

          {/* Categorías */}
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-3 flex justify-between items-center cursor-pointer"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              Espacios
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
                {espacios.filter(e => e.activo).map((espacio) => (
                  <button
                    key={espacio.id}
                    onClick={() => setCurrentFilter(espacio.nombre)}
                    style={{ borderColor: espacio.color }}
                    className={`w-full text-left p-2 rounded-lg transition ${
                      currentFilter === espacio.nombre ? 'bg-gray-200 font-semibold border-l-4' : 'hover:bg-gray-100'
                    }`}
                  >
                    {espacio.nombre}
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
              Anterior
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Hoy
            </button>
            <button 
              onClick={() => changeMonth(1)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition"
            >
              Siguiente
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {espacios.filter(e => e.activo).map((espacio) => (
                <div key={espacio.id} className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: espacio.color }}></span>
                  <span className="text-gray-700">{espacio.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      

     {showCreateModal && (
  <CreateReservationModal 
    onClose={() => setShowCreateModal(false)}
    onSubmit={createReservation}
    espacios={espacios}
    selectedDate={selectedDate}
  />
)}

      {selectedReservation && (
        <ReservationModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
          onCancel={cancelReservation}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
        />
      )}
    </div>
  );
}