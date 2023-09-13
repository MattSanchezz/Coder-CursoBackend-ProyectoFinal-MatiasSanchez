import express from 'express';
const app = express();
import ProductManager from './index.js';

const productManager = new ProductManager('productos.json');
productManager.loadFromFile('productos.json');

app.use(express.json());

app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.json({ products });
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductsById(productId);

  if (product === 'Not Found') {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.json({ product });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
