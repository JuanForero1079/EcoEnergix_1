const DB = require("../db/connection");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AppError = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password");
require("dotenv").config();

/* =====================================================
   VARIABLES DE ENTORNO
===================================================== */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

/* =====================================================
   NODEMAILER
===================================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* =====================================================
   TOKENS
===================================================== */
const generarAccessToken = (user) =>
  jwt.sign(
    {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: String(user.Rol_usuario).toLowerCase(),
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

const generarRefreshToken = (user) =>
  jwt.sign({ id: user.ID_usuario }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

/* =====================================================
   BLOQUEO POR INTENTOS FALLIDOS
===================================================== */
const intentosFallidos = {};
const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 10;

function registrarFallo(correo) {
  if (!intentosFallidos[correo]) {
    intentosFallidos[correo] = { intentos: 1 };
  } else {
    intentosFallidos[correo].intentos++;
  }

  if (intentosFallidos[correo].intentos >= MAX_INTENTOS) {
    intentosFallidos[correo].bloqueadoHasta = new Date(
      Date.now() + BLOQUEO_MINUTOS * 60000
    );
  }
}

/* =====================================================
   REGISTRO
===================================================== */
exports.register = async (req, res, next) => {
  try {
    const { Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario = "cliente" } = req.body;

    if (!Nombre || !Correo_electronico || !Contraseña)
      throw new AppError("Todos los campos son obligatorios", 400);

    const existe = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT ID_usuario FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, r) => (err ? reject(err) : resolve(r))
      );
    });

    if (existe.length > 0)
      throw new AppError("El correo ya está registrado", 400);

    const hashed = await hashPassword(Contraseña);
    const token = crypto.randomBytes(40).toString("hex");
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await new Promise((resolve, reject) => {
      DB.query(
        `INSERT INTO usuarios
        (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento,
         Rol_usuario, verificado, token_verificacion, token_expira_en)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [Nombre, Correo_electronico, hashed, Tipo_documento, Numero_documento, Rol_usuario.toLowerCase(), token, expira],
        (err) => (err ? reject(err) : resolve())
      );
    });

    const link = `${SERVER_URL}/api/auth/verificar/${token}`;
    await transporter.sendMail({
      from: `"Ecoenergix" <${EMAIL_USER}>`,
      to: Correo_electronico,
      subject: "Verifica tu correo ✔",
      html: `<h3>Hola ${Nombre}</h3>
             <p>Tu enlace es válido por 1 hora</p>
             <a href="${link}">Verificar cuenta</a>`,
    });

    res.status(201).json({ message: "Registro exitoso. Verifica tu correo." });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LOGIN
===================================================== */
exports.login = async (req, res, next) => {
  try {
    const { Correo_electronico, Contraseña } = req.body;
    if (!Correo_electronico || !Contraseña)
      throw new AppError("Correo y contraseña obligatorios", 400);

    const bloqueo = intentosFallidos[Correo_electronico];
    if (bloqueo?.bloqueadoHasta && new Date() < bloqueo.bloqueadoHasta)
      throw new AppError("Cuenta bloqueada temporalmente", 429);

    const r = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, r) => (err ? reject(err) : resolve(r))
      );
    });

    if (r.length === 0) {
      registrarFallo(Correo_electronico);
      throw new AppError("Credenciales inválidas", 401);
    }

    const user = r[0];
    const ok = await comparePassword(Contraseña, user.Contraseña);
    if (!ok) {
      registrarFallo(Correo_electronico);
      throw new AppError("Credenciales inválidas", 401);
    }

    if (!user.verificado)
      throw new AppError("Debes verificar tu correo", 401);

    delete intentosFallidos[Correo_electronico];

    const accessToken = generarAccessToken(user);
    const refreshToken = generarRefreshToken(user);

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET refresh_token = ? WHERE ID_usuario = ?",
        [refreshToken, user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({
      accessToken,
      refreshToken,
      usuario: { id: user.ID_usuario, nombre: user.Nombre, rol: user.Rol_usuario },
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   PERFIL
===================================================== */
exports.getPerfil = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuario no autenticado", 401);

    const r = await new Promise((resolve, reject) => {
      DB.query(
        `SELECT ID_usuario, Nombre, Correo_electronico,
                Tipo_documento, Numero_documento,
                Rol_usuario, Foto_usuario
         FROM usuarios
         WHERE ID_usuario = ? LIMIT 1`,
        [userId],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    if (!r[0]) throw new AppError("Usuario no encontrado", 404);

    res.json(r[0]);
  } catch (error) {
    next(error);
  }
};

exports.updatePerfil = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Usuario no autenticado", 401);

    const { Nombre, Tipo_documento, Numero_documento } = req.body;
    if (!Nombre || !Tipo_documento || !Numero_documento)
      throw new AppError("Todos los campos son obligatorios", 400);

    await new Promise((resolve, reject) => {
      DB.query(
        `UPDATE usuarios SET Nombre = ?, Tipo_documento = ?, Numero_documento = ? WHERE ID_usuario = ?`,
        [Nombre, Tipo_documento, Numero_documento, userId],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

exports.uploadFoto = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError("No se envió ninguna imagen", 400);

    const rutaFoto = `/uploads/usuarios/${req.file.filename}`;

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET Foto_usuario = ? WHERE ID_usuario = ?",
        [rutaFoto, req.user?.id],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Foto actualizada correctamente", foto: rutaFoto });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LOGOUT
===================================================== */
exports.logout = async (req, res) => {
  res.json({ message: "Sesión cerrada correctamente" });
};

/* =====================================================
   REFRESH TOKEN
===================================================== */
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) throw new AppError("Refresh token requerido", 400);

    const r = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE refresh_token = ? LIMIT 1",
        [refreshToken],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    if (!r[0]) throw new AppError("Refresh token inválido", 401);

    jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    res.json({
      accessToken: generarAccessToken(r[0]),
      refreshToken: generarRefreshToken(r[0]),
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   VERIFICAR EMAIL
===================================================== */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const r = await new Promise((resolve, reject) => {
      DB.query(
        `SELECT ID_usuario, token_expira_en FROM usuarios WHERE token_verificacion = ? AND verificado = 0 LIMIT 1`,
        [token],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    if (!r[0]) throw new AppError("Token inválido o ya usado", 400);
    if (new Date() > r[0].token_expira_en)
      throw new AppError("El token ha expirado", 400);

    await new Promise((resolve, reject) => {
      DB.query(
        `UPDATE usuarios SET verificado = 1, token_verificacion = NULL, token_expira_en = NULL WHERE ID_usuario = ?`,
        [r[0].ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Correo verificado correctamente" });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   FORGOT PASSWORD
===================================================== */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { Correo_electronico } = req.body;
    if (!Correo_electronico) throw new AppError("Correo es obligatorio", 400);

    const user = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, result) => (err ? reject(err) : resolve(result[0]))
      );
    });

    if (!user) throw new AppError("Usuario no encontrado", 404);

    const token = crypto.randomBytes(20).toString("hex");
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET token_reset = ?, token_reset_expira = ? WHERE ID_usuario = ?",
        [token, expira, user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Link apunta al frontend
    const link = `${FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"Ecoenergix" <${EMAIL_USER}>`,
      to: Correo_electronico,
      subject: "Restablecer contraseña",
      html: `<h3>Hola ${user.Nombre}</h3>
             <p>Haz clic en el enlace para restablecer tu contraseña. Válido por 1 hora:</p>
             <a href="${link}">${link}</a>`,
    });

    res.json({ message: "Revisa tu correo para restablecer la contraseña" });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { Contraseña } = req.body;

    if (!Contraseña) throw new AppError("Contraseña es obligatoria", 400);

    const user = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE token_reset = ? AND token_reset_expira > NOW() LIMIT 1",
        [token],
        (err, result) => (err ? reject(err) : resolve(result[0]))
      );
    });

    if (!user) throw new AppError("Token inválido o expirado", 400);

    const hashed = await hashPassword(Contraseña);

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET Contraseña = ?, token_reset = NULL, token_reset_expira = NULL WHERE ID_usuario = ?",
        [hashed, user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    next(error);
  }
};
