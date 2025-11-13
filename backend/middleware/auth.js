//   Middleware desactivado para pruebas sin token
function verificarToken(req, res, next) {
  // Simplemente dejamos pasar todas las peticiones
  next();
}

//   Middleware desactivado para pruebas sin rol
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    // Permitimos todos los roles
    next();
  };
}

module.exports = { verificarToken, verificarRol };
