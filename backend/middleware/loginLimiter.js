// middleware/loginLimiter.js

const intentos = {}; // { "correo": { count: 0, lastAttempt: timestamp } }
const MAX_INTENTOS = 3;
const BLOQUEO_MS = 5 * 60 * 1000; // 5 minutos

module.exports = (req, res, next) => {
  const { Correo_electronico } = req.body;

  if (!Correo_electronico) {
    return res.status(400).json({ message: "Correo requerido." });
  }

  const ahora = Date.now();

  if (!intentos[Correo_electronico]) {
    intentos[Correo_electronico] = {
      count: 0,
      lastAttempt: ahora,
    };
  }

  const data = intentos[Correo_electronico];

  // Si está bloqueado
  if (data.count >= MAX_INTENTOS) {
    const tiempoRestante = BLOQUEO_MS - (ahora - data.lastAttempt);

    if (tiempoRestante > 0) {
      const segundos = Math.ceil(tiempoRestante / 1000);
      return res.status(429).json({
        message: `Demasiados intentos. Intenta nuevamente en ${segundos} segundos.`,
      });
    } else {
      // Se resetea el bloqueo
      data.count = 0;
    }
  }

  next();
};
