/* eslint-disable @typescript-eslint/no-require-imports */
import app from './app';
import config from './config/config';
const swaggerJsdoc = require("swagger-jsdoc"); 
const swaggerUi = require("swagger-ui-express");

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrackPro',
      version: '1.0.0',
    },
    servers: [
      {
      url: 'http://localhost:' + config.port + '/api/v1',
      description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs =  swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, () => {
  console.log(
    `Server running on port ${config.port} at url: http://localhost:${config.port}`,
  );
});
