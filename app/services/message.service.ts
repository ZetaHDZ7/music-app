import React from 'react'

export const fetchMessages = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/mensajes');
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw new Error('Error en el llamado de la API de mensajes');
  }
}