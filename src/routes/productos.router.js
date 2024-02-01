import { Router } from "express";
import { uploader } from "../utils.js";
import ProductsManager from "../dao/ProductsManagerMongo.js";
import { checkUserRole } from '../middleware/authorizationMiddle.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const productosRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * path:
 *   /api/products:
 *     get:
 *       summary: Obtener todos los productos
 *       description: Obtiene la lista completa de productos.
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con la lista de productos.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "List of products."
 *                 data: [...]
 */

productosRouter.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await ProductsManager.getProducts();

  if (!limit) {
    return res.status(200).json({
      status: "success",
      message: "List of products.",
      data: products,
    });
  } else if (limit > products.length) {
    return res.status(409).json({
      status: "error",
      message: "The entered limit is higher than the number of products.",
      data: {},
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: `The first ${limit} products of the list.`,
      data: products.slice(0, limit),
    });
  }
});

/**
 * @swagger
 * path:
 *   /api/products/{pid}:
 *     get:
 *       summary: Obtener un producto por ID
 *       description: Obtiene un producto específico por su ID.
 *       parameters:
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto a obtener.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el producto solicitado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product found."
 *                 data: {...}
 *         '404':
 *           description: Producto no encontrado.
 */

productosRouter.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await ProductsManager.getProductById(id);

  if (product) {
    res.status(200).json({
      status: "success",
      message: "Product found.",
      data: product,
    });
  } else {
    res.status(409).json({
      status: "error",
      message: "Product does not exist!",
      data: {},
    });
  }
});

/**
 * @swagger
 * path:
 *   /api/products:
 *     post:
 *       summary: Agregar un nuevo producto
 *       description: Agrega un nuevo producto a la lista.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: "Nuevo Producto"
 *               price: 10.99
 *               stock: 50
 *               description: "Descripción del nuevo producto."
 *               thumbnail: "ruta/a/la/imagen.jpg"
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el producto añadido.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product successfully added."
 *                 data: {...}
 *         '409':
 *           description: Producto ya existe o información incompleta.
 */

productosRouter.post("/", checkUserRole('admin'), uploader.single("thumbnail"), async (req, res) => {
  const newProduct = req.body;
  if (req.file) {
    newProduct.thumbnail = req.file.path;
  }
  const product = await ProductsManager.addProduct(newProduct);

  if (product) {
    res.status(200).json({
      status: "success",
      message: "Product successfully added.",
      data: product,
    });
  } else {
    res.status(409).json({
      status: "error",
      message: "The entered product already exists, or the information provided is incomplete.",
      data: {},
    });
  }
});

/**
 * @swagger
 * path:
 *   /api/products/{pid}:
 *     put:
 *       summary: Modificar un producto por ID
 *       description: Modifica un producto existente por su ID.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto a modificar.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: "Producto Modificado"
 *               price: 19.99
 *               stock: 75
 *               description: "Nueva descripción del producto modificado."
 *       responses:
 *         '200':
 *           description: Respuesta exitosa con el producto modificado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product successfully modified."
 *                 data: {...}
 *         '409':
 *           description: Producto no encontrado o información inválida.
 */

productosRouter.put("/:pid", checkUserRole('admin'), async (req, res) => {
  const idProd = parseInt(req.params.pid);
  const updateProduct = req.body;
  const updatedProduct = await ProductsManager.updateProduct(idProd, updateProduct);

  if (updatedProduct) {
    res.status(200).json({
      status: "success",
      message: "Product successfully modified.",
      data: updatedProduct,
    });
  } else {
    res.status(409).json({
      status: "error",
      message: "Product not found or invalid information.",
      data: {},
    });
  }
});

/**
 * @swagger
 * path:
 *   /api/products/{pid}:
 *     delete:
 *       summary: Eliminar un producto por ID
 *       description: Elimina un producto existente por su ID.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: pid
 *           required: true
 *           description: ID del producto a eliminar.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Respuesta exitosa indicando que el producto ha sido eliminado.
 *           content:
 *             application/json:
 *               example:
 *                 status: "success"
 *                 message: "Product successfully deleted."
 *                 data: {}
 *         '409':
 *           description: Producto no encontrado.
 */

productosRouter.delete("/:pid", checkUserRole('admin'), async (req, res) => {
  const idToDelete = parseInt(req.params.pid);
  const deletedProduct = await ProductsManager.deleteProduct(idToDelete);

  if (deletedProduct) {
    return res.status(200).json({
      status: "success",
      message: "Product successfully deleted.",
      data: {},
    });
  } else {
    return res.status(409).json({
      status: "error",
      message: "Product not found.",
      data: {},
    });
  }
});

productosRouter.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(options))
);

export default productosRouter;