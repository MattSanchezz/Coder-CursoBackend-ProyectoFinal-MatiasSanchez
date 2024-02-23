import mongoose from "mongoose";
import config from "../../config.js";


const URI = config.mongo_uri;

mongoose.connect(URI)
.then((db) => console.log('INFO', 'Base de Datos conectada'))
  .catch((error) => console.log('ERROR', `Error al conectar la base de datos: ${error.message}`));
