import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import exphbs from 'express-handlebars';
import { productManager, CartManager } from './index.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.json());

io.on('connection', (socket) => {
  console.log('Cliente WebSocket conectado');
  socket.on('disconnect', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.json({ products });
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductsById(productId);

  if (product === 'Not Found') {
    res.status(404).json({ message: 'El producto no se ha encontrado' });
  } else {
    res.json({ product });
  }
});

app.post('/products', (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  productManager.addProducts(title, description, price, thumbnail, code, stock);

  const newProduct = {
  };
  io.emit('newProduct', newProduct);

  res.status(201).json({ message: 'Producto agregado con éxito' });
});

app.put('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedData = req.body;

  const updatedProduct = productManager.updateProduct(productId, updatedData);

  if (updatedProduct === 'Producto no encontrado') {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.json({ product: updatedProduct });
  }
});

app.delete('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  const result = productManager.deleteProduct(productId);

  if (result === 'Producto no encontrado') {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    io.emit('removeProduct', productId);
    res.json({ message: 'Producto eliminado con éxito' });
  }
});

app.get('/carts', (req, res) => {
  const carts = CartManager.getAllCarts();
  res.json({ carts });
});

app.get('/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = CartManager.getCartById(cartId);

  if (cart) {
    res.json({ cart });
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

app.post('/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = 1;

  const result = CartManager.addToCart(cartId, productId, quantity);

  if (result === 'Carrito no encontrado') {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else if (result === 'Producto no encontrado') {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.status(201).json({ message: 'Producto agregado al carrito con éxito' });
  }
});

app.get('/home', (req, res) => {
  const products = productManager.getProducts();
  res.render('views/home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', (socket) => {
  console.log('Cliente WebSocket conectado');

  socket.on('newProduct', (newProduct) => {
    io.emit('newProduct', newProduct);
  });

  socket.on('removeProduct', (productId) => {
    io.emit('removeProduct', productId);
  });

  socket.on('disconnect', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
})