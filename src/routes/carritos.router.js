import { Router } from "express";
import cartManager from "../dao/CartManagerMongo.js";

const carritosRouter = Router();

carritosRouter.post("/", async (req, res) => {
    const newCart = await cartManager.newCart();

    if(newCart) {
        res.status(200).json({
            status: "success",
            message: "Cart created successfully.",
            data: cartManager.carts[cartManager.carts.length - 1]
        });
    } else {
        res.status(409).json({
            status: "error",
            message: "Couldn't create cart",
            data: {}
        });
    }
});

carritosRouter.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    try {
        const cart = await cartModel
            .findById(cid)
            .populate('products')
            .exec();

        if (cart) {
            res.status(200).json({
                status: "success",
                message: "Cart found.",
                data: cart
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Cart not found.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error fetching cart and associated products.",
            data: error.message
        });
    }
});

carritosRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const addProductToCart = await cartManager.addProductToCart(cid, pid);

    if(addProductToCart) {
        res.status(200).json({
            status: "success",
            message: "Product added to cart successfully.",
            data: addProductToCart
        });
    } else {
        res.status(409).json({
            status: "error",
            message: "Cart or product not exist.",
            data: {}
        });
    }
});

carritosRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    try {
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);

        if (updatedCart) {
            res.status(200).json({
                status: "success",
                message: "Product removed from cart successfully.",
                data: updatedCart
            });
        } else {
            res.status(409).json({
                status: "error",
                message: "Cart or product not found.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error removing product from cart.",
            data: error.message
        });
    }
});

carritosRouter.put("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const newProducts = req.body.products; 

    try {
        const updatedCart = await cartManager.updateCart(cid, newProducts);

        if (updatedCart) {
            res.status(200).json({
                status: "success",
                message: "Cart updated successfully.",
                data: updatedCart
            });
        } else {
            res.status(409).json({
                status: "error",
                message: "Cart not found.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error updating cart.",
            data: error.message
        });
    }
});

carritosRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const newQuantity = req.body.quantity;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, newQuantity);

        if (updatedCart) {
            res.status(200).json({
                status: "success",
                message: "Product quantity updated successfully.",
                data: updatedCart
            });
        } else {
            res.status(409).json({
                status: "error",
                message: "Cart or product not found.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error updating product quantity.",
            data: error.message
        });
    }
});

carritosRouter.delete("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    try {
        const result = await cartManager.deleteAllProductsInCart(cid);

        if (result) {
            res.status(200).json({
                status: "success",
                message: "All products in the cart have been removed successfully.",
                data: {}
            });
        } else {
            res.status(409).json({
                status: "error",
                message: "Cart not found or no products to delete.",
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error removing products from the cart.",
            data: error.message
        });
    }
});

export default carritosRouter;