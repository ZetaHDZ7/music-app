'use client';

import React, { useState, useEffect } from 'react';

// Define la estructura de un mensaje para TypeScript
interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
  created_at: string;
}

// Lógica para obtener la URL base de la API de forma segura
const getApiBaseUrl = () => {
    const fullUrl = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL)
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:8000/api/mensajes';
    
    // Si la URL contiene /mensajes, asumimos que es la URL completa para el POST y recortamos la ruta
    // para obtener la base /api para luego concatenar el GET endpoint.
    return fullUrl.endsWith('/mensajes') 
        ? fullUrl.substring(0, fullUrl.lastIndexOf('/')) 
        : fullUrl;
};

const API_BASE_URL = getApiBaseUrl();


interface MensajesListProps {
    onBackToForm: () => void; // Función para volver al formulario
}

/**
 * Componente para mostrar una lista interactiva de mensajes recibidos.
 */
const MensajesList: React.FC<MensajesListProps> = ({ onBackToForm }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener los datos de la API (GET a /api/mensajes)
    const fetchMensajes = async () => {
      // Usamos el punto final /mensajes completo
      const endpoint = `${API_BASE_URL}/mensajes`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar los mensajes. Código: ${response.status}`);
        }

        const result = await response.json();
        // Asumiendo que la respuesta es { data: [...] }
        setMensajes(result.data || []);
      } catch (err) {
        // En caso de error de red o de la API
        console.error("Fetch Error:", err);
        setError('No se pudieron cargar los mensajes. Asegúrate de que el backend de Laravel esté activo en ' + endpoint);
      } finally {
        setLoading(false);
      }
    };

    fetchMensajes();
  }, []);

  // Función para formatear la fecha a un formato legible
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // ----------------------------------------------------
  // Renderizado Condicional del Estado
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
        <div className="text-center p-12">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-indigo-600 font-semibold">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error de Conexión:</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button onClick={onBackToForm} className="mt-4 block text-sm font-semibold text-red-500 hover:text-red-800">
              ← Volver al Formulario
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Renderizado de la Lista de Mensajes
  // ----------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-1xl font-extrabold text-gray-900">Mensajes Recibidos ({mensajes.length})</h2>
        <button
          onClick={onBackToForm}
          className="flex items-center space-x-1 py-1 px-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md transform hover:scale-[1.03]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H14a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
          </svg>
          <span>Volver al Formulario</span>
        </button>
      </div>

      {mensajes.length === 0 ? (
        <p className="text-center text-xl text-gray-500 p-10 bg-gray-50 rounded-lg shadow-inner border border-dashed">
          No hay mensajes recibidos aún. ¡Envía uno usando el formulario!
        </p>
      ) : (
        <div className="space-y-4">
          {mensajes.map((mensaje) => (
            <div 
              key={mensaje.id}
              // El estilo de tarjeta es limpio y responsivo
              
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-800 break-words max-w-[80%]">{mensaje.mensaje}</h3>
                <span className="text-sm font-medium text-gray-500 flex-shrink-0 ml-4">
                  {formatDate(mensaje.created_at)}
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-medium mb-3 border-b border-gray-100 pb-2">{mensaje.nombre} &lt;{mensaje.email}&gt;</p>
              {/* Contenido con espacio en blanco pre-línea para preservar formato si lo hubiera */}
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MensajesList;