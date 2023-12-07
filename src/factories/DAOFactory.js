import CartManagerMongo from "../dao/CartManagerMongo.js";
import ProductsManagerMongo from "../dao/ProductsManagerMongo.js";
import UsersManager from "../dao/usersManager.js";
import ChatManager from "../dao/ChatManager.js";

function createDAOManager(daoType) {
  switch (daoType) {
    case "cart":
      return CartManagerMongo;
    case "products":
      return ProductsManagerMongo;
    case "users":
      return UsersManager;
    case "chat":
      return ChatManager;
    default:
      throw new Error("Tipo de DAO no válido");
  }
}

export default createDAOManager;