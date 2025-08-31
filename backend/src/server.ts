/* eslint-disable @typescript-eslint/no-require-imports */
import app from './app';
import config from './config/config';
const swaggerJsdoc = require("swagger-jsdoc"); 
const swaggerUi = require("swagger-ui-express");
import options from './docs/swaggeroptions'

const specs =  swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, () => {
  console.log(
    `Server running on port ${config.port} at url: http://localhost:${config.port}`,
  );
});
