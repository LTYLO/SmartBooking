import React from "react";
import logo2 from 'assets/img/background.jpg';

const PanelAdmin = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">

      {/* Fondo con imagen y blur sutil */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${logo2})`,
          filter: 'blur(3px)',
          transform: 'scale(1.02)'
        }}
      />
      <div className="fixed inset-0 -z-10 bg-white/30" />

      {/* Contenido principal */}
      <div className="relative z-10 text-center">
        
        {/* Loader animado */}
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 border-4 border-[#c9b39c] border-t-transparent rounded-full animate-spin drop-shadow-[0_0_20px_rgba(201,179,156,0.7)]"></div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Panel en Proceso de Administración
        </h1>

        <p className="text-[#4a4035] text-lg max-w-xl mx-auto leading-relaxed font-semibold">
          Estamos preparando tu panel administrativo con herramientas avanzadas
          y un diseño altamente interactivo. Por favor espera un momento...
        </p>

      </div>
    </div>
  );
};

export default PanelAdmin;