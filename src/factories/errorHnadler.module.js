const errorDictionary = {
    PRODUCT_NOT_FOUND: "Producto no encontrado",
    PRODUCT_ALREADY_IN_CART: "Producto ya está en el carrito",
    INSUFFICIENT_STOCK: "Stock insuficiente para el producto",
  };
  
  const errorHandler = (errorCode) => {
    const errorMessage = errorDictionary[errorCode] || "Error desconocido";
    const error = new Error(errorMessage);
    error.code = errorCode;
    return error;
  };
  
  export default errorHandler;