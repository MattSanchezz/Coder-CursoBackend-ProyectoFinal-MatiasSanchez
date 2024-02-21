import ProductManagerMongo from "../dao/ProductsManagerMongo.js";
import CartManagerMongo from "../dao/CartManagerMongo.js";
import { sendUserPremiumEmail } from "../services/email.service.js";

async function getProducts(req, res, next) {
  try {
    const { query, limit, page, sort } = req.query;

    const products = await ProductManagerMongo.getProducts(query, limit, page, sort);

    products.status = products.payload.length > 0 ? "success" : "error";

    delete products.totalDocs;
    delete products.limit;
    delete products.pagingCounter;

    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/api/products?page=${products.prevPage}`
      : null;
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/api/products?page=${products.nextPage}`
      : null;

    res.status(200).json({ result: products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { pid } = req.params;

    const product = await ProductManagerMongo.getById(pid);

    if (product) {
      res.status(200).json({ product: product });
    } else {
      res.status(400).json({ product: "Not found" });
    }
  } catch (error) {
    next(error);
  }
}

async function addProduct(req, res, next) {
  try {
    if (req.user.role !== 'premium') {
      return res.status(403).json({ error: 'Only premium users can create products' });
    }

    const newProduct = { ...req.body, owner: req.user.email, thumbnails: [] };

    if (req.files) {
      req.files.forEach((file, index) => {
        newProduct.thumbnails.push({ idPhoto: index, url: file.path });
      });
    }

    const result = await ProductManagerMongo.create(newProduct);

    res.status(201).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function updateProductById(req, res, next) {
  try {
    const { pid } = req.params;

    const isAdmin = req.user.role === 'admin';
    const product = await ProductManagerMongo.getById(pid);

    if (!isAdmin && product.owner !== req.user.email) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
    }

    let newProductInfo = { ...req.body, thumbnails: [] };

    if (req.files) {
      newProductInfo.thumbnails = req.files.map((file) => file.path);
    }

    const result = await ProductManagerMongo.updateById(pid, newProductInfo);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function deleteProductById(req, res, next) {
  try {
      const { pid } = req.params;

      const isAdmin = req.user.role === 'admin';
      const product = await ProductManagerMongo.getById(pid);

      if (!isAdmin && product.owner !== req.user.email) {
          return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
      }

      const result = await ProductManagerMongo.deleteById(pid);

      await CartManagerMongo.deleteProductFromCarts(pid);

      if (product.ownerRole === 'premium') {
          await sendUserPremiumEmail(product.ownerEmail, 'Producto eliminado', 'Tu producto ha sido eliminado');
      }

      res.status(200).json({ message: result });
  } catch (error) {
      next(error);
  }
}

export {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
