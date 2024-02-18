import express from "express";
import cartsRouter from "./carritos.router.js";
import productsRouter from "./productos.router.js";
import sessionRouter from "./session.router.js";
import loggerTestRouter from "./logger.router.js";
import viewsRouter from "./views.router.js";

const apiRouter = express.Router();

apiRouter.use("/productos", productsRouter);
apiRouter.use("/carritos", cartsRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/loggerTest", loggerTestRouter);
apiRouter.use("/views", viewsRouter);

export default apiRouter;