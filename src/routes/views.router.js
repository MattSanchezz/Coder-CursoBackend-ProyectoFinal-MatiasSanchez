import { Router } from "express";
import productManager from "../dao/ProductsManagerMongo.js";
import { enviarMensaje } from '../controllers/chat.controller.js';

const viewsRouter = Router();

viewsRouter.get("/home", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", {products});
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    return res.status(200).render("realTimeProducts", {products});
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartModel
            .findOne({ idCart: cid })
            .populate("products")
            .exec();

        if (cart) {
            res.render("cart", { cart });
        } else {
            res.status(404).json({
                status: "error",
                message: "Carrito no encontrado.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al cargar el carrito y sus productos.",
            data: error.message
        });
    }
});

viewsRouter.get("/chat", (req, res) => {
    res.render("chat");
});

viewsRouter.post("/enviar-mensaje", enviarMensaje);

viewsRouter.get("/", (req, res) => {
    res.render("login");
  });
  
viewsRouter.get("/signup", (req, res) => {
    res.render("signup");
  });

export default viewsRouter;