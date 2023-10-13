import express from "express";
import handlebars from "express-handlebars";
import apiRouter from "./routes/api.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { initializeSocket } from "./socket/socketServer.js";
import "./db/configDB.js";
import ChatManager from "./dao/ChatManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const httpServer = app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
});

initializeSocket(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("chat");
});

app.post("/enviar-mensaje", async (req, res) => {
    const { usuario, mensaje } = req.body;

    try {
        const mensajeGuardado = await ChatManager.guardarMensaje(usuario, mensaje);
        res.status(200).json({
            status: "success",
            message: "Mensaje guardado con éxito.",
            data: mensajeGuardado,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al guardar el mensaje.",
            data: error.message,
        });
    }
});

app.use("/api", apiRouter);
app.use("/", viewsRouter);
app.get("*", async (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Route not found.",
        data: {}
    })
});