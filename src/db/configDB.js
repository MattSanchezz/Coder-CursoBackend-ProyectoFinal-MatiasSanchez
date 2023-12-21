import mongoose from "mongoose";
import config from "../../config.js";


const URI = config.mongo_uri;

mongoose.connect(URI)
.then((db) => log('INFO', 'Base de Datos conectada'))
  .catch((error) => log('ERROR', `Error al conectar la base de datos: ${error.message}`));
