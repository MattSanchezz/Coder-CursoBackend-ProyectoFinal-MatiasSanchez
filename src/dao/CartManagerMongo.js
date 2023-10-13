import { cartModel } from "./modelos/carts.model";
import { productsModel } from "./modelos/products.model";

class CartManagerMongo {
  async createCart(idCart) {
    try {
      const cart = new cartModel({
        idCart,
        products: [],
      });

      const createdCart = await cart.save();

      return createdCart;
    } catch (error) {
      throw new Error("Error al crear un carrito: " + error.message);
    }
  }

  async getCartById(idCart) {
    try {
      const cart = await cartModel.findOne({ idCart }).exec();
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async addProductToCart(idCart, idProduct) {
    try {
      const cart = await cartModel.findOne({ idCart }).exec();
      if (!cart) {
        throw new Error("Carrito no encontrado.");
      }

      const product = await productsModel.findById(idProduct).exec();
      if (!product) {
        throw new Error("Producto no encontrado.");
      }

      const cartProduct = cart.products.find((p) => p.product.toString() === idProduct);

      if (cartProduct) {
        cartProduct.quantity += 1;
      } else {
        cart.products.push({
          product: idProduct,
          quantity: 1,
        });
      }

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error("Error al agregar un producto al carrito: " + error.message);
    }
  }

  async updateCart(idCart, cartData) {
    try {
      const cart = await cartModel.findOne({ idCart }).exec();
      if (!cart) {
        throw new Error("Carrito no encontrado.");
      }

      // Realiza las actualizaciones necesarias en el carrito.

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }

  async removeProductFromCart(idCart, idProduct) {
    try {
      const cart = await cartModel.findOne({ idCart }).exec();
      if (!cart) {
        throw new Error("Carrito no encontrado.");
      }

      const cartProductIndex = cart.products.findIndex((p) => p.product.toString() === idProduct);

      if (cartProductIndex !== -1) {
        cart.products.splice(cartProductIndex, 1);
        const updatedCart = await cart.save();
        return updatedCart;
      } else {
        throw new Error("Producto no encontrado en el carrito.");
      }
    } catch (error) {
      throw new Error("Error al eliminar un producto del carrito: " + error.message);
    }
  }

}

export default new CartManagerMongo();