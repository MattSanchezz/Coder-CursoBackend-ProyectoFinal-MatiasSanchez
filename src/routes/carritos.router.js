import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cartManager from '../dao/CartManagerMongo.js';
import { checkUserRole } from '../middleware/authorizationMiddle.js';
import { generateUniqueCode, addTicket } from '../repositories/TicketsRepository.js';
import productsManager from '../dao/ProductsManagerMongo.js';
import errorHandler from '../factories/errorHandler.module.js';
import { log, logLevels } from '../logger.js';

const carritosRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Carritos
 *   description: Operaciones relacionadas con carritos de compras
 */

/**
 * @swagger
 * path:
 *   /api/carts:
 *     post:
 *       summary: Crear un nuevo carrito
 *       description: Crea un nuevo carrito de compras para el usuario.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el carrito creado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Cart created successfully."
 *                 data: {...}
 *         '409':
 *           description: No se pudo crear el carrito.
 */

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}:
 *     get:
 *       summary: Obtener un carrito por ID
 *       description: Obtiene un carrito específico por su ID.
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito a obtener.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el carrito solicitado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Cart found."
 *                 data: {...}
 *         '404':
 *           description: Carrito no encontrado.
 */

carritosRouter.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCart(cid);

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}/product/{pid}:
 *     post:
 *       summary: Agregar un producto a un carrito por ID
 *       description: Agrega un producto a un carrito existente por su ID.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito al que se agregará el producto.
 *           schema:
 *             type: string
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto a agregar al carrito.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa indicando que el producto ha sido agregado al carrito.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product added to cart successfully."
 *                 data: {...}
 *         '409':
 *           description: Carrito o producto no existen.
 */

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}:
 *     put:
 *       summary: Actualizar un carrito por ID
 *       description: Actualiza un carrito específico por su ID.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito a actualizar.
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           required: true
 *           description: Nuevo contenido del carrito.
 *           schema:
 *             type: object
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el carrito actualizado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Cart updated successfully."
 *                 data: {...}
 *         '409':
 *           description: Carrito no encontrado.
 */

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}/products/{pid}:
 *     put:
 *       summary: Actualizar la cantidad de un producto en un carrito
 *       description: Actualiza la cantidad de un producto específico en un carrito.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito que contiene el producto.
 *           schema:
 *             type: string
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto cuya cantidad se actualizará.
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           required: true
 *           description: Nueva cantidad del producto.
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con la cantidad de producto actualizada en el carrito.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product quantity updated successfully."
 *                 data: {...}
 *         '409':
 *           description: Carrito o producto no encontrado.
 */

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}/products/{pid}:
 *     delete:
 *       summary: Eliminar un producto de un carrito
 *       description: Elimina un producto específico de un carrito.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito que contiene el producto.
 *           schema:
 *             type: string
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto a eliminar del carrito.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el producto eliminado del carrito.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product removed from cart successfully."
 *                 data: {...}
 *         '409':
 *           description: Carrito o producto no encontrado.
 */

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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}:
 *     delete:
 *       summary: Eliminar todos los productos de un carrito
 *       description: Elimina todos los productos de un carrito específico.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito del que se eliminarán los productos.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa indicando que todos los productos han sido eliminados del carrito.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "All products in the cart have been removed successfully."
 *                 data: {}
 *         '409':
 *           description: Carrito no encontrado o no hay productos para eliminar.
 */
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

/**
 * @swagger
 * path:
 *   /api/carts/{cid}/purchase:
 *     post:
 *       summary: Realizar una compra con un carrito
 *       description: Realiza una compra con los productos en un carrito específico.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID del carrito que se utilizará para la compra.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa indicando que la compra se realizó con éxito.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Compra realizada con éxito."
 *                 data: {...}
 *         '400':
 *           description: El carrito está vacío. No se puede realizar la compra.
 *         '404':
 *           description: Producto no encontrado al intentar procesar la compra.
 *         '500':
 *           description: Error desconocido al procesar la compra.
 */
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

  carritosRouter.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(options))
  );

export default carritosRouter;
