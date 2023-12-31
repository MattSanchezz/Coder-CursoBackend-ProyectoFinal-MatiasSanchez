import { Router } from "express";
import cartManager from "../dao/CartManagerMongo.js";
import { checkUserRole } from "../middleware/authorizationMiddle.js";
import { generateUniqueCode, addTicket } from "../repositories/TicketsRepository.js";
import productsManager from "../dao/ProductsManagerMongo.js";
import errorHandler from "../factories/errorHandler.module.js";
import { log, logLevels } from '../logger.js';

const carritosRouter = Router();

carritosRouter.post("/", checkUserRole("user"), async (req, res) => {
    const newCart = await cartManager.newCart();

    if (newCart) {
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

carritosRouter.post("/:cid/product/:pid", checkUserRole("user"), async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const addProductToCart = await cartManager.addProductToCart(cid, pid);

    if (addProductToCart) {
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

carritosRouter.put("/:cid", checkUserRole("user"), async (req, res) => {
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

carritosRouter.put("/:cid/products/:pid", checkUserRole("user"), async (req, res) => {
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

carritosRouter.delete("/:cid/products/:pid", checkUserRole("user"), async (req, res) => {
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

carritosRouter.delete("/:cid", checkUserRole("user"), async (req, res) => {
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

carritosRouter.post("/:cid/purchase", async (req, res) => {
    const cid = parseInt(req.params.cid);
  
    try {
      const cart = await cartManager.getCart(cid);
  
      if (!cart || !cart.products || cart.products.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "El carrito está vacío. No se puede realizar la compra.",
          data: {},
        });
      }
  
      const productsNotProcessed = [];
  
      for (const product of cart.products) {
        const productId = product.productId;
        const quantity = product.quantity;
  
        const productInStock = await productsManager.getProductById(productId);
  
        if (!productInStock) {
          const error = errorHandler("PRODUCT_NOT_FOUND");
          return res.status(404).json({
            status: "error",
            message: error.message,
            data: { productId },
          });
        }
  
        if (productInStock.stock >= quantity) {
          productInStock.stock -= quantity;
  
          await productsManager.updateProduct(productId, productInStock);
        } else {
          productsNotProcessed.push(productId);
          continue;
        }
      }
  
      if (productsNotProcessed.length > 0) {
        const error = errorHandler("INSUFFICIENT_STOCK");
        return res.status(400).json({
          status: "error",
          message: error.message,
          data: { productsNotProcessed },
        });
      }
  
      const ticket = {
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: cart.total,
        purchaser: req.user.email,
      };
  
      const savedTicket = await addTicket(ticket);
  
      await cartManager.deleteAllProductsInCart(cid);
  
      return res.status(200).json({
        status: "success",
        message: "Compra realizada con éxito.",
        data: savedTicket,
      });
    } catch (error) {
      const customError = errorHandler("UNKNOWN_ERROR");
      log(logLevels.ERROR, customError.message);
      return res.status(500).json({
        status: "error",
        message: customError.message,
        data: {},
      });
    }
  });

export default carritosRouter;
