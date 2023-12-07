class ProductsRepository {
    constructor(productsManager) {
      this.productsManager = productsManager;
    }
  
    async getProducts() {
      try {
        const products = await this.productsManager.getProducts();
        return products;
      } catch (error) {
        throw new Error(`Error al obtener los productos: ${error.message}`);
      }
    }
  
    async getProductById(idProduct) {
      try {
        const product = await this.productsManager.getProductById(idProduct);
        return product;
      } catch (error) {
        throw new Error(`Error al obtener el producto por ID: ${error.message}`);
      }
    }
  
    async addProduct(newProduct) {
      try {
        const savedProduct = await this.productsManager.addProduct(newProduct);
        return savedProduct;
      } catch (error) {
        throw new Error(`Error al agregar un producto: ${error.message}`);
      }
    }
  
    async updateProduct(idProduct, updateProduct) {
      try {
        const updatedProduct = await this.productsManager.updateProduct(idProduct, updateProduct);
        return updatedProduct;
      } catch (error) {
        throw new Error(`Error al actualizar el producto: ${error.message}`);
      }
    }
  
    async deleteProduct(idProduct) {
      try {
        const deletedProduct = await this.productsManager.deleteProduct(idProduct);
        return deletedProduct;
      } catch (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`);
      }
    }
  }
  
  export default ProductsRepository;
  