import Footer from "components/navigation/Footer"
import Navbar from "components/navigation/Navbar"
import Body from "components/navigation/Body"

import Layout from "hocs/layouts/layout"

import React, { useState, useEffect, useRef } from 'react';

// 1. TUS IMPORTACIONES REALES:
//    >>> DEBES DESCOMENTAR ESTAS LÍNEAS EN TU PROYECTO REAL <<<
// import Footer from "components/navigation/Footer"
// import Navbar from "components/navigation/Navbar"
// import Body from "components/navigation/Body"
// import Layout from "hocs/layouts/layout"


// 2. >>>>>>>>>>> INICIO: COMPONENTES DE REEMPLAZO (ELIMINAR ESTO EN TU PROYECTO REAL) <<<<<<<<<<<

/**
 * Componente de Layout de reemplazo.
 * (ELIMINAR)
 */


/**
 * Componente de Navbar de reemplazo.
 * (ELIMINAR)
 */



function Reservas(){
    // Estado para manejar si el menú de perfil está abierto o cerrado
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    // Ref para detectar clics fuera del menú
    const profileRef = useRef(null);

    // Efecto para cerrar el menú si se hace clic fuera de él
    useEffect(() => {
        function handleClickOutside(event) {
            // Si el ref existe y el clic fue fuera del elemento con ref
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        // Añadir el listener
        document.addEventListener("mousedown", handleClickOutside);
        // Limpiar el listener al desmontar el componente
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]); // La dependencia es el ref

    return(
        // Cuando descomentes tus imports, este será tu Layout real
        <Layout>
            {/* Cuando descomentes tus imports, este será tu Navbar real */}
            <Navbar/>
            
            {/* INICIO: Contenido principal de Mi Perfil y Mis Reservas */}
            <div className="bg-gray-100 min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Contenedor del Perfil y Menú Desplegable */}
                    <div ref={profileRef} className="relative mb-8">
                        {/* Cabecera del Perfil (Botón de despliegue) */}
                        <div 
                            id="profile-toggle" 
                            onClick={() => setIsProfileOpen(prev => !prev)} 
                            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center cursor-pointer border border-gray-200"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Icono de Perfil */}
                                <div className="bg-blue-500 rounded-lg p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                {/* Textos de Perfil */}
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
                                    <p className="text-sm text-gray-500">Gestiona tu información personal</p>
                                </div>
                                {/* Flecha de despliegue */}
                                <svg 
                                    id="profile-arrow" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {/* Botón Editar Perfil */}
                            <button className="hidden md:flex items-center space-x-2 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                                <span>Editar Perfil</span>
                            </button>
                        </div>

                        {/* Menú Desplegable */}
                        <div 
                            id="profile-dropdown" 
                            className={`absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-lg p-6 mt-1 border border-t-0 border-gray-200 z-10 ${isProfileOpen ? '' : 'hidden'}`}
                        >
                            <ul className="space-y-4">
                                {/* ID de Usuario */}
                                <li className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">ID de usuario:</span>
                                    <span className="text-gray-900">2</span>
                                </li>
                                {/* Nombre Completo */}
                                <li className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">Nombre completo:</span>
                                    <span className="text-gray-900">Hassan Emilio Kabande Laija</span>
                                </li>
                                {/* Correo Electrónico */}
                                <li className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">Correo electrónico:</span>
                                    <span className="text-gray-900">pp@gmail.com</span>
                                </li>
                                {/* Teléfono */}
                                <li className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">Teléfono:</span>
                                    <span className="text-gray-900">123456</span>
                                </li>
                            </ul>
                            {/* Botón Editar Perfil (visible en móvil) */}
                            <button className="mt-6 w-full flex md:hidden items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                                <span>Editar Perfil</span>
                            </button>
                        </div>
                    </div>

                    {/* Pestaña "Mis reservas" */}
                    <div className="flex justify-center mb-8">
                        <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-full shadow-sm border border-gray-300">
                            Mis reservas
                        </button>
                    </div>

                    {/* Contenido Principal: Mis Reservas */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Mis Reservas</h2>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Añadir Nueva Reserva</span>
                        </button>
                    </div>

                    {/* Cuadrícula de Reservas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Tarjeta de Reserva 1 */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <img src="https://placehold.co/600x400/6366F1/FFFFFF?text=Auditorio+Principal" alt="Imagen del evento" className="w-full h-48 object-cover" />
                            <div className="p-5">
                                {/* Iconos de Información */}
                                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">24/02/26</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Auditorio Principal</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">10 A.M.</span>
                                    </div>
                                </div>
                                {/* Link Ver Detalles */}
                                <a href="#" className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:underline mb-5">
                                    <span>Ver detalles</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                                {/* Botones de Acción */}
                                <div className="flex space-x-3">
                                    <button className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">Editar</button>
                                    <button className="flex-shrink-0 bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Reserva 2 (Placeholder) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center text-gray-400">
                            <span className="text-lg">Próxima Reserva</span>
                        </div>

                        {/* Tarjeta de Reserva 3 (Placeholder) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center text-gray-400">
                            <span className="text-lg">Próxima Reserva</span>
                        </div>

                    </div>
                </div>
            </div>
            {/* FIN: Contenido principal de Mi Perfil y Mis Reservas */}

            {/* Cuando descomentes tus imports, este será tu Footer real */}
            <Footer/>
        </Layout>
    )
}
export default Reservas