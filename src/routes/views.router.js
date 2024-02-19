import { Router } from "express";
import productManager from "../dao/ProductsManagerMongo.js";
import { renderChatPage, enviarMensaje } from '../controllers/chat.controller.js';
import { loadCart, renderCartPage } from '../controllers/cart.controller.js';

const viewsRouter = Router();

viewsRouter.get("/home", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    return res.status(200).render("realTimeProducts", { products });
});

viewsRouter.get("/carts/:cid", loadCart, renderCartPage);

viewsRouter.get("/chat", renderChatPage);

viewsRouter.post("/enviar-mensaje", enviarMensaje);

viewsRouter.get("/", (req, res) => {
    res.render("login");
});

viewsRouter.get("/signup", (req, res) => {
    res.render("signup");
});

export default viewsRouter;
