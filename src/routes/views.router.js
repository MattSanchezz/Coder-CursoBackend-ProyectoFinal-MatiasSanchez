import { Router } from "express";
import productManager from "../services/ProductsManager.js";

const viewsRouter = Router();

viewsRouter.get("/home", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", {products});
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    return res.status(200).render("realTimeProducts", {products});
});

export default viewsRouter;