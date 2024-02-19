import CartManagerMongo from "../dao/CartManagerMongo.js";
import { CartModel } from "../dao/modelos/carts.model.js";

async function addProductToCartById(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await CartManagerMongo.addProductToCart(
      cid,
      pid,
      req.body.quantity
    );

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function createCart(req, res, next) {
  try {
    const result = await CartManagerMongo.create(req.body);

    res.status(201).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function getProductsOfCartById(req, res, next) {
  try {
    const { cid } = req.params;

    const cart = await CartManagerMongo.getById(cid);

    res.status(200).json({ products: cart.products });
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromCart(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await CartManagerMongo.deleteProductFromCart(cid, pid);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function deleteCart(req, res, next) {
  try {
    const { cid } = req.params;

    const result = await CartManagerMongo.deleteProductsFromCart(cid);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function updateProductOfCartById(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await CartManagerMongo.updateProductOfCartById(
      cid,
      pid,
      req.body.quantity
    );

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function updateProductsOfCart(req, res, next) {
  try {
    const { cid } = req.params;

    const result = await CartManagerMongo.updateById(cid, req.body);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function getCartOfActiveUser(req, res, next) {
  try {
    const id = req.user._id;

    const result = await CartManagerMongo.getByFilter({ userId: id });

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const userId = req.user._id;
    const productId = req.body.productId;

    const existingCartItem = await CartManagerMongo.getCartItem(userId, productId);

    if (existingCartItem) {
      if (req.user.role === 'premium' && existingCartItem.owner.toString() === userId.toString()) {
        return res.status(400).json({ message: "No puedes agregar tu propio producto al carrito." });
      }
    }

    res.status(200).json({ message: "Producto agregado al carrito correctamente." });
  } catch (error) {
    next(error);
  }
}
export const loadCart = async (req, res, next) => {
  const { cid } = req.params;
  try {
      const cart = await CartModel.findOne({ idCart: cid }).populate('products').exec();
      if (!cart) {
          return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
      }
      req.cart = cart;
      next();
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al cargar el carrito y sus productos.', data: error.message });
  }
};

export const renderCartPage = (req, res) => {
  const { cart } = req;
  res.render('cart', { cart });
};

export {
  addProductToCartById,
  createCart,
  getProductsOfCartById,
  deleteProductFromCart,
  deleteCart,
  updateProductOfCartById,
  updateProductsOfCart,
  getCartOfActiveUser,
  addToCart,
  loadCart,
  renderCartPage,
};