const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3", // versión válida
    info: {
      title: "API Mi Proyecto",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    servers: [
      { url: "http://localhost:3001" }
    ],
  },
  apis: ["./routes/*.js"], // JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = specs; //   solo exportar specs
