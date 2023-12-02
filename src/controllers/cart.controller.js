import CartManagerMongo from "../dao/CartManagerMongo";

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

export {
  addProductToCartById,
  createCart,
  getProductsOfCartById,
  deleteProductFromCart,
  deleteCart,
  updateProductOfCartById,
  updateProductsOfCart,
  getCartOfActiveUser,
};