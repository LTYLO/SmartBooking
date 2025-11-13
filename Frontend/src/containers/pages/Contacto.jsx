// Contacto.jsx
import React, { useState } from 'react';
import Footer from "components/navigation/Footer";
import Navbar from "components/navigation/Navbar";
import Layout from "hocs/layouts/layout";

// --- 1. Definición del Color Personalizado ---
const CUSTOM_YELLOW = '#FFEE58';

// --- 2. Componente de Red Social (Auxiliar) ---
const SocialIcon = ({ name, iconPath, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" 
       className="flex flex-col items-center group space-y-2 hover:opacity-80 transition duration-150">
        <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center shadow-lg">
            {/* SVG Placeholder para el ícono */}
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d={iconPath} />
            </svg>
        </div>
        <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{name}</span>
    </a>
);

// --- 3. Componente del Formulario de Contacto (Diseño Principal) ---
const ContactForm = () => {
    // Lógica JavaScript (React Hook) para manejar el estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        mensaje: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del formulario enviados:', formData);
        alert(`Formulario enviado por ${formData.nombre}! Revisa la consola.`);
        
        // Limpiar formulario
        setFormData({ nombre: '', telefono: '', email: '', mensaje: '' });
    };

    return (
        /* CLASE CRUCIAL para el centrado: 
           flex-grow: Ocupa todo el espacio vertical entre Navbar y Footer.
           items-center justify-center: Centra el formulario horizontal y verticalmente. */
        <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Lado del Formulario (Amarillo) */}
                <div style={{ backgroundColor: CUSTOM_YELLOW }} className="w-full md:w-1/2 p-8 sm:p-10">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Contáctanos</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Campo Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-800">Nombre</label>
                            <input
                                type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}
                                className="mt-1 block w-full border-2 border-gray-900 rounded-md p-3 shadow-md focus:ring-gray-900 focus:border-gray-900"
                                required
                            />
                        </div>

                        {/* Campo Número de teléfono */}
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-semibold text-gray-800">Número de teléfono</label>
                            <input
                                type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}
                                className="mt-1 block w-full border-2 border-gray-900 rounded-md p-3 shadow-md focus:ring-gray-900 focus:border-gray-900"
                                required
                            />
                        </div>

                        {/* Campo Correo Electrónico */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Correo Electrónico</label>
                            <input
                                type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                                className="mt-1 block w-full border-2 border-gray-900 rounded-md p-3 shadow-md focus:ring-gray-900 focus:border-gray-900"
                                required
                            />
                        </div>

                        {/* Campo Mensaje */}
                        <div>
                            <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-800">Mensaje</label>
                            <textarea
                                id="mensaje" name="mensaje" rows="4" value={formData.mensaje} onChange={handleChange}
                                className="mt-1 block w-full border-2 border-gray-900 rounded-md p-3 shadow-md focus:ring-gray-900 focus:border-gray-900 resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Botón Enviar */}
                        <button
                            type="submit"
                            className="w-auto px-8 py-3 mt-4 border border-transparent rounded-md shadow-lg text-base font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            Enviar
                        </button>
                    </form>
                </div>

                {/* Lado de las Redes Sociales (Blanco) */}
                <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col items-center justify-center bg-white">
                    <div className="grid grid-cols-2 gap-8 text-center">
                        <SocialIcon name="INSTAGRAM" link="#" iconPath="M22 6.5A.5.5 0 0021.5 6h-19A.5.5 0 002 6.5v11A.5.5 0 002.5 18h19a.5.5 0 00.5-.5v-11zM12 16a4 4 0 100-8 4 4 0 000 8zM12 10a2 2 0 110 4 2 2 0 010-4zm6.5-3a.5.5 0 100 1 .5.5 0 000-1z"/>
                        <SocialIcon name="TWITTER" link="#" iconPath="M22.46 6c-.77.35-1.6.58-2.48.66.88-.53 1.56-1.37 1.88-2.38-.83.5-1.74.84-2.72 1.03-1.02-1.09-2.48-1.77-4.14-1.77-3.13 0-5.67 2.54-5.67 5.67 0 .45.05.88.13 1.3-4.71-.24-8.89-2.49-11.69-5.91-.49.85-.77 1.84-.77 2.9 0 1.96 1 3.68 2.5 4.7-.92-.03-1.79-.28-2.55-.7v.07c0 2.74 1.95 5.03 4.52 5.56-.47.13-.97.2-1.48.2-.36 0-.71-.03-1.05-.1.72 2.25 2.8 3.89 5.27 3.93-1.93 1.51-4.36 2.41-7 2.41-.46 0-.91-.03-1.36-.08 2.49 1.6 5.46 2.54 8.64 2.54 10.37 0 16.05-8.6 16.05-16.05v-.76c1.1-.79 2.05-1.78 2.8-2.88z"/>
                        <SocialIcon name="FACEBOOK" link="#" iconPath="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"/>
                        <SocialIcon name="LINKEDIN" link="#" iconPath="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8 17h3v-7H8v7zM9.5 7.5A1.5 1.5 0 118 6a1.5 1.5 0 011.5 1.5zM16 17h3v-4.47c0-2.34-1.84-3.53-3.26-3.53a3.37 3.37 0 00-3.26 2.6V10H10v7h3v-3.79c0-1.12.6-1.76 1.4-1.76.8 0 1.4.63 1.4 1.76V17z"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. Componente Principal de la Página ---
function Contacto(){
    return(
        /* ASUMIMOS que Layout tiene 'min-h-screen flex flex-col' para que el centrado funcione */
        <Layout>
            <Navbar/>
            
            {/* El formulario se coloca en el centro, usando el espacio restante */}
            <ContactForm /> 

            <Footer/>
        </Layout>
    )
}

export default Contacto;