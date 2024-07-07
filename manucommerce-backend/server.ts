import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose, { Document, Schema, ConnectOptions } from 'mongoose';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mi Tienda',
      version: '1.0.0',
      description: 'Documentación de la API de Mi Tienda',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./server.ts'], // Ruta al archivo con las definiciones de las rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

interface IProduct extends Document {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  category?: string;
  image?: string;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String }
});

const Product = mongoose.model<IProduct>('Product', productSchema);

interface ISale extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  date: Date;
}

const saleSchema = new Schema<ISale>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  totalPrice: Number,
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model<ISale>('Sale', saleSchema);

// Swagger schemas and routes remain the same

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    console.log('Recibida solicitud para añadir producto:', req.body);
    const newProduct = new Product(req.body);
    console.log('Nuevo producto creado:', newProduct);
    const savedProduct = await newProduct.save();
    console.log('Producto guardado en la base de datos:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(400).json({ message: (error as Error).message });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.get('/api/sales', async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post('/api/sales', async (req: Request, res: Response) => {
  try {
    const newSale = new Sale(req.body);
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));