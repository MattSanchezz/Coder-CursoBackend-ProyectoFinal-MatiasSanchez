import {productsModel} from "../dao/modelos/products.model.js";

function createProductModel(data) {
  return new productsModel(data);
}

class ProductManagerMongo {
  async addProduct(newProduct) {
    try {
      const product = createProductModel({
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock || 0,
        description: newProduct.description || "",
      });

      const savedProduct = await product.save();

      return savedProduct;
    } catch (error) {
      throw new Error("Error al agregar un producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await productsModel.find().exec();

      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos: " + error.message);
    }
  }

  async getProductById(idProd) {
    try{ 
      const product = await productsModel.findById(idProd).exec();

      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  }

  async updateProduct(idProd, updateProduct) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(idProd, updateProduct, {
        new: true,
      }).exec();

      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProduct(idProd) {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(idProd).exec();

      return deletedProduct;
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }

  async findAllProducts(obj) {
    console.log("obj", obj);
    const { limit = 10, page = 1, sort, ...queryfilter } = obj;
    const response = await productsModel.paginate(queryfilter, {
      limit,
      page,
      sort: { price: sortPrice === "asc" ? 1 : -1 },
      lean: true,
    });
    return response;
  }
}

export default new ProductManagerMongo();