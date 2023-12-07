import createDAOManager from "../factories/DAOFactory.js";

const daoType = "cart";

const selectedDAOManager = createDAOManager(daoType);

const cart = selectedDAOManager.getCartById(cartId);
const product = selectedDAOManager.getProductById(productId);

const newCartManager = createDAOManager("cart");
const newProductManager = createDAOManager("products");