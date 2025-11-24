import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from 'assets/img/background.jpg';

const PanelAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Abrir inmediatamente en nueva pestaña
    window.open("http://127.0.0.1:8000/admin/", "_blank");
    
    // Redirigir inmediatamente al home
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Mismo fondo */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${logo2})`, filter: 'blur(3px)' }}
      />
      
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Redirigiendo al inicio...</p>
      </div>
    </div>
  );
};

export default PanelAdmin;