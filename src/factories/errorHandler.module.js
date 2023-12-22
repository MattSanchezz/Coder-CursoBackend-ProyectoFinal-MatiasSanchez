const errorDictionary = {
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'Producto no encontrado.',
    status: 404,
  },
  PRODUCT_ALREADY_IN_CART: {
    code: 'PRODUCT_ALREADY_IN_CART',
    message: 'Producto ya está en el carrito.',
    status: 409,
  },
  INSUFFICIENT_STOCK: {
    code: 'INSUFFICIENT_STOCK',
    message: 'Stock insuficiente para el producto.',
    status: 400,
  },
};

const errorHandler = (errorCode) => {
  const errorDetails = errorDictionary[errorCode] || {
    code: 'UNKNOWN_ERROR',
    message: 'Error desconocido.',
    status: 500,
  };

  const error = new Error(errorDetails.message);
  error.code = errorDetails.code;
  return error;
};

export default errorHandler;