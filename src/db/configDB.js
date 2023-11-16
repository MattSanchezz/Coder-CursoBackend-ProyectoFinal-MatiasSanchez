import mongoose from "mongoose";
import config from "../../config.js";


const URI = config.mongo_uri;

mongoose.connect(URI)
.then((db) => console.log("Base de Datos conectada"))
.catch((err) => console.log(err))
