require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
const cors = require('cors')
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String }
});

const Product = mongoose.model('Product', productSchema);

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  totalPrice: Number,
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

// CRUD operations for products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    console.log('Recibida solicitud para añadir producto:', req.body);
    const newProduct = new Product(req.body);
    console.log('Nuevo producto creado:', newProduct);
    const savedProduct = await newProduct.save();
    console.log('Producto guardado en la base de datos:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD operations for sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const newSale = new Sale(req.body);
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));