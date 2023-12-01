import cartManager from "../dao/CartManagerMongo";

async function addProductToCartById(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await cartManager.addProductToCart(
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
    const result = await cartManager.create(req.body);

    res.status(201).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function getProductsOfCartById(req, res, next) {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getById(cid);

    res.status(200).json({ products: cart.products });
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromCart(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await cartManager.deleteProductFromCart(cid, pid);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function deleteCart(req, res, next) {
  try {
    const { cid } = req.params;

    const result = await cartManager.deleteProductsFromCart(cid);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function updateProductOfCartById(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await cartManager.updateProductOfCartById(
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

    const result = await cartManager.updateById(cid, req.body);

    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
}

async function getCartOfActiveUser(req, res, next) {
  try {
    const id = req.user._id;

    const result = await cartManager.getByFilter({ userId: id });

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