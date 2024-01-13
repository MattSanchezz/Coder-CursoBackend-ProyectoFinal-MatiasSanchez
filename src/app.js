import "dotenv/config.js"
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import apiRouter from "./routes/api.router.js";
import viewsRouter from "./routes/views.router.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddle.js";
import __dirname from "./utils.js";
import { initializeSocket } from "./socket/socketServer.js";
import "./db/configDB.js";
import ChatManager from "./dao/ChatManager.js";
import passport from "passport";
import "./passport.js"
import { initializeFactories } from "./factories/DAOFactory.js";
import loggerTestRouter from "./routes/logger.router.js";
import { isLoggedIn } from './middleware/authorizationMiddle.js';
import resetRouter from './routes/resetPassword.router.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();
const PORT = 8080;

initializeFactories(app);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const URI =
    "mongodb+srv://matsanchez01:Mmm333ole@mattcluster.xdkwueb.mongodb.net/dbProyectoMatt?retryWrites=true&w=majority";
app.use(
  session({
    secret: "SESSIONSECRETKEY",
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    store: new MongoStore({
      mongoUrl: URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mi Proyecto',
      version: '1.0.0',
      description: 'Documentación de la API de Mi Proyecto',
    },
  },
  apis: ['routes/productos.router.js', 'routes/carritos.router.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/dashboard",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

app.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { user: req.user });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.use (errorHandlerMiddleware);

const httpServer = app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`)
});

initializeSocket(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");

app.get("/chat", (req, res) => {
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

app.use('/reset-password', resetRouter);
app.use("/api", apiRouter);
app.use("/", viewsRouter);
app.use('/loggerTest', loggerTestRouter);
app.get("*", async (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Route not found.",
        data: {}
    })
});

