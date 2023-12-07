class CartRepository {
  constructor(cartManager) {
    this.cartManager = cartManager;
  }

  async getCartById(idCart) {
    try {
      const cart = await this.cartManager.getCartById(idCart);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
  }

  async addProductToCart(idCart, idProduct) {
    try {
      const updatedCart = await this.cartManager.addProductToCart(idCart, idProduct);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al agregar un producto al carrito: ${error.message}`);
    }
  }

  async updateCart(idCart, cartData) {
    try {
      const updatedCart = await this.cartManager.updateCart(idCart, cartData);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async removeProductFromCart(idCart, idProduct) {
    try {
      const updatedCart = await this.cartManager.removeProductFromCart(idCart, idProduct);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar un producto del carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(idCart, idProduct, newQuantity) {
    try {
      const updatedCart = await this.cartManager.updateProductQuantity(idCart, idProduct, newQuantity);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }

  async deleteAllProductsInCart(idCart) {
    try {
      const updatedCart = await this.cartManager.deleteAllProductsInCart(idCart);
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar todos los productos del carrito: ${error.message}`);
    }
  }
}

export default CartRepository;