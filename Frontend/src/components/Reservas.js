import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus, X, AlertCircle, Check } from 'lucide-react';

// Hook personalizado para autenticación
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (token) {
      setUser({ token, userName, userEmail });
    }
    setLoading(false);
  }, []);

  return { user, loading };
};

// Modal para editar perfil
const EditProfileModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: user.userName || '',
    email: user.userEmail || '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validar que las contraseñas coincidan si se ingresaron
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Recargar para actualizar los datos
      }, 1500);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Editar Perfil</h3>
            <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            ¡Perfil actualizado exitosamente!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de teléfono (opcional)"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Cambiar Contraseña (opcional)</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dejar en blanco para no cambiar"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? 'Guardando...' : success ? '¡Guardado!' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para ver detalles de reserva
const ReservationDetailModal = ({ reservation, onClose, onCancel }) => {
  if (!reservation) return null;

  const canCancel = reservation.estado === 'pendiente' || reservation.estado === 'confirmada';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Detalles de la Reserva</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 p-4 rounded-lg bg-blue-50" style={{ borderLeftColor: reservation.espacio_color }}>
            <p className="text-sm font-medium text-gray-600">Espacio</p>
            <p className="text-xl font-bold text-gray-900">{reservation.espacio_nombre}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="font-semibold text-gray-900">{reservation.fecha}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Horario</p>
                <p className="font-semibold text-gray-900">{reservation.hora_inicio} - {reservation.hora_fin}</p>
              </div>
            </div>
          </div>

          {reservation.numero_personas && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Número de personas</p>
                <p className="font-semibold text-gray-900">{reservation.numero_personas}</p>
              </div>
            </div>
          )}

          {reservation.motivo && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Motivo</p>
              <p className="text-sm text-gray-900">{reservation.motivo}</p>
            </div>
          )}

          <div className="flex items-center justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              reservation.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
              reservation.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {reservation.estado_display}
            </span>
          </div>

          {canCancel && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
            >
              Cancelar Reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal para crear nueva reserva
const CreateReservationModal = ({ onClose, onSubmit, espacios }) => {
  const [formData, setFormData] = useState({
    espacio: '',
    fecha: new Date().toISOString().split('T')[0],
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Nueva Reserva</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            ¡Reserva creada exitosamente!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Espacio *</label>
            <select
              value={formData.espacio}
              onChange={(e) => setFormData({...formData, espacio: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora inicio *</label>
              <input
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora fin *</label>
              <input
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de personas</label>
            <input
              type="number"
              value={formData.numero_personas}
              onChange={(e) => setFormData({...formData, numero_personas: e.target.value})}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({...formData, motivo: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el motivo de tu reserva..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? 'Creando...' : success ? '¡Creada!' : 'Crear Reserva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Reservas() {
  const API_BASE_URL = 'http://localhost:8000/api';
  const { user, loading: authLoading } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchEspacios();
      fetchReservas();
    }
  }, [user]);

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
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/reservas/`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReservas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (formData) => {
    if (!user?.token) {
      throw new Error('Debes iniciar sesión');
    }

    const response = await fetch(`${API_BASE_URL}/reservas/reservas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMsg = 'Error al crear la reserva: ';
      
      if (error.non_field_errors) {
        errorMsg += error.non_field_errors[0];
      } else if (typeof error === 'object') {
        const errorMessages = Object.entries(error)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        errorMsg += errorMessages;
      }
      
      throw new Error(errorMsg);
    }

    await fetchReservas();
    return await response.json();
  };

  const cancelReservation = async (reservaId) => {
    if (!user?.token) return;
    
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reservas/reservas/${reservaId}/cancelar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        await fetchReservas();
        setSelectedReservation(null);
        alert('Reserva cancelada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al cancelar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar la reserva');
    }
  };

  const updateProfile = async (formData) => {
    if (!user?.token) {
      throw new Error('Debes iniciar sesión');
    }

    // Preparar datos para enviar (solo incluir password si se ingresó)
    const dataToSend = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono || undefined
    };

    if (formData.password) {
      dataToSend.password = formData.password;
    }

    const response = await fetch(`${API_BASE_URL}/users/update_profile/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMsg = 'Error al actualizar el perfil: ';
      
      if (typeof error === 'object') {
        const errorMessages = Object.entries(error)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        errorMsg += errorMessages;
      }
      
      throw new Error(errorMsg);
    }

    // Actualizar localStorage
    localStorage.setItem('userName', formData.nombre);
    localStorage.setItem('userEmail', formData.email);

    return await response.json();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesión Requerida</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para ver tus reservas</p>
          <a href="/InciarSesion" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Perfil */}
        <div ref={profileRef} className="relative mb-8">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
            className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center cursor-pointer border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-gray-500">Gestiona tu información personal</p>
              </div>
            </div>
            <svg 
              className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {isProfileOpen && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-lg p-6 mt-1 border border-t-0 border-gray-200 z-10">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <span className="text-xs text-gray-500">Nombre</span>
                    <p className="font-medium text-gray-900">{user.userName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="font-medium text-gray-900">{user.userEmail}</p>
                  </div>
                </div>
                
                {/* Botón Editar Perfil */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowEditProfileModal(true);
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Encabezado de Reservas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-3xl font-bold text-gray-900">Mis Reservas</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Reserva</span>
          </button>
        </div>

        {/* Lista de Reservas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No tienes reservas</p>
            <p className="text-gray-500 mb-6">Crea tu primera reserva para comenzar</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Reserva</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: reserva.espacio_color }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{reserva.espacio_nombre}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">{reserva.fecha}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm">{reserva.hora_inicio} - {reserva.hora_fin}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                      reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reserva.estado_display}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedReservation(reserva)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {showCreateModal && (
        <CreateReservationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createReservation}
          espacios={espacios}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfileModal(false)}
          onSubmit={updateProfile}
        />
      )}

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onCancel={cancelReservation}
        />
      )}
    </div>
  );
}

export default Reservas;