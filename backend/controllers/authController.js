// controllers/authController.js
const DB = require("../db/connection");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AppError = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password"); // <- tu capa centralizada
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const SERVER_URL = process.env.SERVER_URL;

// -----------------------------
// Configuración de nodemailer
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==============================
// REGISTER
// ==============================
exports.register = async (req, res, next) => {
  try {
    const { Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento } = req.body;

    if (!Nombre || !Correo_electronico || !Contraseña || !Tipo_documento || !Numero_documento) {
      throw new AppError("Todos los campos son obligatorios", 400);
    }

    // Verificar si el correo ya existe
    const existingUser = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [Correo_electronico],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (existingUser.length > 0) throw new AppError("Correo ya registrado", 400);

    // Hash de la contraseña usando password.js
    const contraseñaHasheada = await hashPassword(Contraseña);

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(40).toString("hex");
    const expiraEn = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Insertar usuario
    await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO usuarios 
        (Nombre, Correo_electronico, Contraseña, Tipo_documento, Numero_documento, Rol_usuario, verificado, token_verificacion, token_expira_en)
        VALUES (?, ?, ?, ?, ?, 'cliente', 0, ?, ?)
      `;
      DB.query(
        insertQuery,
        [Nombre, Correo_electronico, contraseñaHasheada, Tipo_documento, Numero_documento, tokenVerificacion, expiraEn],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Enviar correo de verificación
    const link = `${SERVER_URL}/api/auth/verificar/${tokenVerificacion}`;
    await transporter.sendMail({
      from: `"Ecoenergix" <${process.env.EMAIL_USER}>`,
      to: Correo_electronico,
      subject: "Verifica tu correo ✔",
      html: `
        <h2>Hola ${Nombre}, ¡bienvenido a Ecoenergix! 🌞</h2>
        <p>Tu enlace es válido durante <strong>1 hora</strong>.</p>
        <a href="${link}" style="color:#008f39; font-weight:bold; font-size:18px; text-decoration:none;">
          ✔ Verificar mi cuenta
        </a>
      `,
    });

    res.status(201).json({
      message: "Registro exitoso. Revisa tu correo y verifica tu cuenta antes de iniciar sesión.",
    });
  } catch (error) {
    next(new AppError(error.message || "Error en el registro", error.statusCode || 500));
  }
};

// ==============================
// VERIFY EMAIL
// ==============================
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

    if (!results || results.length === 0) throw new AppError("Token inválido", 400);

    const user = results[0];
    if (new Date() > new Date(user.token_expira_en)) {
      throw new AppError("El enlace de verificación expiró. Regístrate nuevamente.", 400);
    }

    await new Promise((resolve, reject) => {
      DB.query(
        "UPDATE usuarios SET verificado = 1, token_verificacion = NULL, token_expira_en = NULL WHERE ID_usuario = ?",
        [user.ID_usuario],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({ message: "Correo verificado correctamente. Ya puedes iniciar sesión." });
  } catch (error) {
    next(new AppError(error.message || "Error al verificar correo", error.statusCode || 500));
  }
};

// ==============================
// LOGIN
// ==============================
exports.login = async (req, res, next) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) throw new AppError("Correo y contraseña son obligatorios.", 400);

    const results = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT * FROM usuarios WHERE Correo_electronico = ? LIMIT 1",
        [correo],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (!results || results.length === 0) throw new AppError("Usuario no encontrado", 401);

    const user = results[0];

    if (!user.Contraseña) throw new AppError("Usuario sin contraseña registrada", 500);

    // Comparar contraseña usando password.js
    const passwordCorrecta = await comparePassword(contraseña, user.Contraseña);

    if (!passwordCorrecta) throw new AppError("Contraseña incorrecta", 401);
    if (user.verificado === 0) throw new AppError("Debes verificar tu correo antes de iniciar sesión.", 401);

    const token = jwt.sign(
      { id: user.ID_usuario, correo: user.Correo_electronico, rol: user.Rol_usuario },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({
      token,
      usuario: {
        id: user.ID_usuario,
        nombre: user.Nombre,
        correo: user.Correo_electronico,
        rol: user.Rol_usuario,
      },
    });
  } catch (error) {
    next(new AppError(error.message || "Error al iniciar sesión", error.statusCode || 500));
  }
};
