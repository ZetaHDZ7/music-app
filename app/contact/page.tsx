"use client"

import React, { useEffect, useState } from "react"
import Layout from "../components/Layout"

export default function Page() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [notification, setNotification] = useState<null | { type: 'success' | 'error' | 'info'; text: string }>(null)

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ text, type })

    setTimeout(() => setNotification(null), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      showNotification('Todos los campos son obligatorios.', 'error')
      return
    }

    setSending(true)

    try {

      await new Promise((res) => setTimeout(res, 900))
      setName("")
      setEmail("")
      setMessage("")
      showNotification('Mensaje enviado correctamente.', 'success')
    } catch (err) {
      console.error(err)
      showNotification('Error al enviar el mensaje. Intenta de nuevo más tarde.', 'error')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (notification?.type === 'error') {
      const el = document.getElementById('name') as HTMLInputElement | null
      el?.focus()
    }
  }, [notification])

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-white">Contacto</h1>

        {/* Región de notificación accesible */}
        <div aria-live="polite" aria-atomic="true">
          {notification && (
            <div
              role="status"
              className={`mb-4 p-3 rounded-lg ${
                notification.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {notification.text}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de contacto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full border rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full border rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full border rounded-lg p-2 min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
          </div>
        </div>
      </Layout>
    )
  }
