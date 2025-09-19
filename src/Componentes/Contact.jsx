import { useState } from "react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que no haya campos vacíos
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Por favor completa todos los campos antes de enviar.")
      return
    }

    setError("")
    alert(`Mensaje enviado de: ${form.name} (${form.email})`)
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <section
      id="contact"
      className="w-full flex items-center justify-center py-17 sm:py-15 px-4"
    >
      <div className="w-full max-w-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6">
          Contáctanos
        </h2>
        <p className="text-base sm:text-lg text-center text-white/80 mb-8">
          ¿Tienes dudas o sugerencias?  
          Déjanos tu mensaje y te responderemos lo antes posible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Tu correo"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#4375b2] outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1">Mensaje</label>
            <textarea
              rows="4"
              name="message"
              placeholder="Escribe tu mensaje"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#5f54b3] text-white py-3 rounded-lg font-semibold hover:bg-[#3dc692] transition"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </section>
  )
}

