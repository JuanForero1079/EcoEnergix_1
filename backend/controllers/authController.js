const DB = require("../db/connection");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AppError = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password");
require("dotenv").config();

// -----------------------------
// Variables de entorno
// -----------------------------
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SERVER_URL = process.env.SERVER_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// -----------------------------
// Nodemailer config
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// -----------------------------
// TOKEN GENERATORS
// -----------------------------
const generarAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.ID_usuario,
      correo: user.Correo_electronico,
      rol: user.Rol_usuario.toLowerCase(),
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generarRefreshToken = (user) => {
  return jwt.sign(
    { id: user.ID_usuario },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// =====================================================
// SISTEMA DE BLOQUEO TEMPORAL (ANTI ATAQUES)
// =====================================================
const intentosFallidos = {}; // { correo: { intentos: n, bloqueadoHasta: Date } }
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

// =====================================================
// REGISTER
// =====================================================
exports.register = async (req, res, next) => {
  try {
    const {
      Nombre,
      Correo_electronico,
      Contraseña,
      Tipo_documento,
      Numero_documento,
      Rol_usuario = "cliente",
    } = req.body;

    if (!Nombre || !Correo_electronico || !Contraseña || !Tipo_documento || !Numero_documento)
      throw new AppError("Todos los campos son obligatorios", 400);

    const existingUser = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (existingUser.length > 0)
      throw new AppError("El correo ya está registrado", 400);

    const hashedPassword = await hashPassword(Contraseña);

    const tokenVerificacion = crypto.randomBytes(40).toString("hex");
    const expiraEn = new Date(Date.now() + 60 * 60 * 1000);

    await new Promise((resolve, reject) => {
      DB.query(
        `INSERT INTO usuarios 
          (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario, verificado, token_verificacion, token_expira_en)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          Nombre,
          Correo_electronico,
          hashedPassword,
          Tipo_documento,
          Numero_documento,
          Rol_usuario.toLowerCase(),
          tokenVerificacion,
          expiraEn,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });

    const link = `${SERVER_URL}/api/auth/verificar/${tokenVerificacion}`;

    await transporter.sendMail({
      from: `"Ecoenergix" <${EMAIL_USER}>`,
      to: Correo_electronico,
      subject: "Verifica tu correo ✔",
      html: `<h2>Hola ${Nombre}, ¡bienvenido a Ecoenergix!</h2>
             <p>Tu enlace es válido por <strong>1 hora</strong>.</p>
             <a href="${link}" style="color:#008f39; font-weight:bold; font-size:18px;">✔ Verificar mi cuenta</a>`,
    });

    res.status(201).json({
      message: "Registro exitoso. Verifica tu correo antes de iniciar sesión.",
    });
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500));
  }
};

// =====================================================
// VERIFY EMAIL
// =====================================================
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    const results = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE token_verificacion = ? LIMIT 1",
        [token],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (results.length === 0)
      throw new AppError("Token inválido", 400);

    const user = results[0];

    if (new Date() > new Date(user.token_expira_en))
      throw new AppError("El enlace expiró. Regístrate nuevamente.", 400);

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET verificado = 1, token_verificacion = NULL, token_expira_en = NULL WHERE ID_usuario = ?",
        [user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Correo verificado exitosamente." });
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500));
  }
};

// =====================================================
// LOGIN (CON BLOQUEO DE INTENTOS)
// =====================================================
exports.login = async (req, res, next) => {
  try {
    const { Correo_electronico, Contraseña } = req.body;

    if (!Correo_electronico || !Contraseña)
      throw new AppError("Correo y contraseña son obligatorios.", 400);

    // -------------------------
    // REVISAR BLOQUEO
    // -------------------------
    const registro = intentosFallidos[Correo_electronico];

    if (registro && registro.bloqueadoHasta) {
      if (new Date() < registro.bloqueadoHasta) {
        const tiempoRestante = Math.ceil(
          (registro.bloqueadoHasta - new Date()) / 60000
        );
        throw new AppError(
          `Demasiados intentos fallidos. Vuelve a intentar en ${tiempoRestante} minutos.`,
          429
        );
      } else {
        intentosFallidos[Correo_electronico] = { intentos: 0 };
      }
    }

    // -------------------------
    // BUSCAR USUARIO
    // -------------------------
    const results = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (results.length === 0) {
      registrarFallo(Correo_electronico);
      throw new AppError("Usuario o contraseña incorrectos", 401);
    }

    const user = results[0];

    // -------------------------
    // VALIDAR PASSWORD
    // -------------------------
    const passwordCorrecta = await comparePassword(Contraseña, user.Contraseña);

    if (!passwordCorrecta) {
      registrarFallo(Correo_electronico);
      throw new AppError("Usuario o contraseña incorrectos", 401);
    }

    // Limpiar intentos fallidos
    if (intentosFallidos[Correo_electronico])
      delete intentosFallidos[Correo_electronico];

    // -------------------------
    // VERIFICACIÓN DE CORREO
    // -------------------------
    if (user.verificado === 0)
      throw new AppError("Debes verificar tu correo.", 401);

    // -------------------------
    // GENERAR TOKENS
    // -------------------------
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
      message: "Inicio de sesión exitoso",
      accessToken,
      refreshToken,
      usuario: {
        id: user.ID_usuario,
        nombre: user.Nombre,
        correo: user.Correo_electronico,
        rol: user.Rol_usuario.toLowerCase(),
      },
    });
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500));
  }
};

// =====================================================
// REFRESH TOKEN
// =====================================================
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      throw new AppError("No se recibió refreshToken", 400);

    const results = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE refresh_token = ? LIMIT 1",
        [refreshToken],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (results.length === 0)
      throw new AppError("Refresh token inválido", 401);

    const user = results[0];

    try {
      jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AppError("Refresh token expirado o inválido", 401);
    }

    const nuevoAccess = generarAccessToken(user);
    const nuevoRefresh = generarRefreshToken(user);

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET refresh_token = ? WHERE ID_usuario = ?",
        [nuevoRefresh, user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({
      accessToken: nuevoAccess,
      refreshToken: nuevoRefresh,
    });
  } catch (error) {
    next(new AppError(error.message, error.statusCode || 500));
  }
};
