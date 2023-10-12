import mongoose from "mongoose";

const URI = "mongodb+srv://matsanchez01:Mmm333ole@mattcluster.xdkwueb.mongodb.net/dbProyectoMatt?retryWrites=true&w=majority";

mongoose.connect(URI)
.then((db) => console.log("Base de Datos conectada"))
.catch((err) => console.log(err))
