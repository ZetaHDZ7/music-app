// ...existing code...
'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MensajesList from './MensajesList'; // <-- agregado

// 1. Definición de Tipos con TypeScript
// Define la estructura de los datos del formulario y la respuesta de la API.
interface FormData {
  nombre: string;
  email: string;
  mensaje: string;
}

interface ApiResponse {
    message: string;
    errors?: Record<string, string[]>; // Para errores de validación de Laravel (código 422)
}

// FIX: Se realiza una comprobación defensiva para 'process' para evitar ReferenceError
// Si 'process' no está definido (como en algunos sandboxes), usa directamente el fallback.
const API_BASE_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8000/api/mensajes';

// Propiedades del componente para recibir la función de cambio de vista
// interface ContactFormProps {
//     onViewMessages: () => void;
// }

/**
 * Componente funcional para el formulario de contacto.
 * Utiliza Tailwind CSS para un diseño moderno y responsivo.
 */

//const Home: React.FC<ContactFormProps> = ({ onViewMessages }) => {
const Home: React.FC = () => {
  const [viewMessages, setViewMessages] = useState<boolean>(false); // <-- agregado

  // Estado inicial del formulario
  const initialFormData: FormData = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  // Estados de la aplicación
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string>('');

  /**
   * Maneja el cambio en los campos del formulario.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo específico al escribir
    if (apiErrors[name]) {
        setApiErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
    // Oculta el estado de éxito/error general al empezar a escribir
    setStatus(null);
    setMessage('');
  };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setApiErrors({});
    setMessage('');

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // 201 Created (Éxito de Laravel)
        if (response.ok && response.status === 201) {
            const data: ApiResponse = await response.json();
            setStatus('success');
            setMessage(data.message || 'Mensaje enviado correctamente.');
            setFormData(initialFormData); // Limpiar formulario
        } 
        
        // 422 Unprocessable Content (Errores de Validación de Laravel)
        else if (response.status === 422) {
            const data = await response.json();
            setApiErrors(data.errors || {});
            setStatus('error');
            setMessage(data.message || 'Por favor, corrige los errores en el formulario.');
        } 
        
        // Otros Errores de API (ej. 500 Internal Server Error)
        else {
            setStatus('error');
            setMessage('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
        }

    } catch (error) {
        // Errores de red (Network errors)
        console.error('Network Error:', error);
        setStatus('error');
        setMessage('No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
        setLoading(false);
    }
  };
  
  // Función auxiliar para renderizar los errores específicos
  const renderFieldError = (field: keyof FormData) => {
      const errors = apiErrors[field];
      if (errors) {
          return (
              <p className="text-sm text-red-500 mt-1">{errors.join(', ')}</p>
          );
      }
      return null;
  };

  // Clases comunes de Tailwind para los inputs
  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out bg-white/70 backdrop-blur-sm text-black";
  return (
    <Layout>
      <Head>
      <title>Inicio - Melodía Records</title>
      <meta name="description" content="Descubre los últimos lanzamientos y artistas destacados de Melodía Records." />
      </Head>

      <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Contáctanos</h2>
      <p className="text-center text-gray-600 mb-8">Envíanos un mensaje y te responderemos a la brevedad.</p>

      {/* Notificación de Estado */}
      {status && message && (
        <div 
          className={`p-4 mb-6 rounded-lg font-medium text-white ${
            status === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className={inputClass}
            required
            disabled={loading}
          />
          {renderFieldError('nombre')}
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className={inputClass}
            required
            disabled={loading}
          />
          {renderFieldError('email')}
        </div>

        {/* Campo Mensaje */}
        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={4}
            placeholder="Escribe tu mensaje aquí..."
            className={`${inputClass} resize-none`}
            required
            disabled={loading}
          />
          {renderFieldError('mensaje')}
        </div>

        {/* Contenedor de Botones */}
        <div className="flex space-x-4">
            {/* Botón de Envío (Primario) */}
            <button
                type="submit"
                disabled={loading}
                className={`flex-grow py-3 px-4 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform ${
                    loading
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01]'
                }`}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </div>
                ) : (
                    'Enviar Mensaje'
                )}
            </button>
            
            {/* Botón para cambiar a la vista de mensajes (Secundario) */}
            <button
                type="button"
                onClick={() => setViewMessages(true)} // <-- cambiado
                disabled={loading}
                className={`py-3 px-4 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform flex-shrink-0 ${
                    loading
                        ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:scale-[1.01]'
                }`}
                title="Ver mensajes recibidos"
            >
                {/* Icono de bandeja de entrada/mensajes */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 2H4v8h12V7zM4 13h4v-2H4v2z" />
                </svg>
            </button>
        </div>
      </form>
      {/* Renderizar la lista de mensajes cuando viewMessages === true */}
      {viewMessages && (
        <div className="mt-8">
          <MensajesList onBackToForm={() => setViewMessages(false)} />
        </div>
      )}
    </div>

    </Layout>
  );
};

export default Home;