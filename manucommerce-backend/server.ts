import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

fetch(`${API_URL}/api/products`)
  .then(response => response.json())
  .then(data => console.log(data));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.PRODUCTION_URL || 'https://ecommerce-one-virid.vercel.app', 'https://ecommerce-omp9.onrender.com']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


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
        url: process.env.NODE_ENV === 'production'
          ? 'https://ecommerce-omp9.onrender.com'
          : `http://localhost:${process.env.PORT || 10000}`,
        description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./dist/server.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('Swagger UI configurado en /api-docs');

// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI no está definido en las variables de entorno');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Conectado a MongoDB Atlas');
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Colecciones en la base de datos:');
      collections.forEach(collection => console.log(collection.name));
    } catch (error) {
      console.error('Error al listar las colecciones:', error);
    }
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB Atlas:', err);
    process.exit(1);
  });

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

const Product = mongoose.model<IProduct>('products', productSchema);

interface ISale extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  date: Date;
}

const saleSchema = new Schema<ISale>({
  productId: { type: Schema.Types.ObjectId, ref: 'products' },
  quantity: Number,
  totalPrice: Number,
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model<ISale>('Sale', saleSchema);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado
 */
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

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Obtiene todas las ventas
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 */
app.get('/api/sales', async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate('productId');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Crea una nueva venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       201:
 *         description: Venta creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 */
app.post('/api/sales', async (req: Request, res: Response) => {
  try {
    const newSale = new Sale(req.body);
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: El nombre de usuario ya está en uso
 */
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Intento de registro para:', username);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('El usuario ya existe:', username);
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log('Usuario registrado exitosamente:', username);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error:any) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 userId:
 *                   type: string
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Intento de inicio de sesión para:', username);
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Usuario no encontrado:', username);
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    console.log('Usuario encontrado:', user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado de la comparación de contraseñas:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definido en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    console.log('Token generado para:', username);
    res.json({ token, userId: user._id });
  } catch (error:any) {
    console.error('Error detallado en el login:', error);
    res.status(500).json({ 
      message: 'Error en el login', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         image:
 *           type: string
 *     Sale:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - totalPrice
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: number
 *         totalPrice:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 */

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'El servidor está funcionando' });
});

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err.code === 11000) {
    res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));