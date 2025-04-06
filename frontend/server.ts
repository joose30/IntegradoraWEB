import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import doorRoutes from './src/routes/doorRoutes';
import userRoutes from './src/routes/userRoutes';
import empresaRoutes from './src/routes/empresaRoutes';
import productRoutes from './src/routes/productRoutes';
import preguntasFrecuentesRoutes from './src/routes/preguntasFrecuentesRoutes';
import purchaseRoutes from './src/routes/purchaseRoutes';
import registroRoutes from './src/routes/registroRoutes'; // Asegúrate de importar las rutas de registros
import fingerprintRoutes from './src/routes/fingerprintRoutes';
import deviceRoutes from './src/routes/deviceRoutes'; // Importar nuevas rutas de dispositivos

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;

// Conexión a la base de datos
connectDB();

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/door', doorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/preguntasFrecuentes', preguntasFrecuentesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/registros', registroRoutes); // Esta línea es la que faltaba
app.use('/api/huella', fingerprintRoutes);
app.use('/api/devices', deviceRoutes); // Agregar rutas de dispositivos

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    routes: {
      registros: '/api/registros',
      registrosUltimos: '/api/registros/ultimos',
      devices: '/api/devices'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:${PORT}');
  console.log('Rutas disponibles:');
  console.log('GET /api/registros');
  console.log('GET /api/registros/ultimos');
  console.log('POST /api/devices/register');
  console.log('GET /api/devices/user');
});