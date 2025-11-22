const bcrypt = require("bcrypt");

// Hashear contraseña
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Comparar contraseña
const comparePassword = async (plain, hash) => {
  if (!hash) return false;
  return await bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };
