import express from "express";
import cartsRouter from "./carritos.router.js";
import productsRouter from "./productos.router.js";

const apiRouter = express.Router();

apiRouter.use("/productos", productsRouter);
apiRouter.use("/carritos", cartsRouter);

export default apiRouter;