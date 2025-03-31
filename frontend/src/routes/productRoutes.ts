// IntegradoraWEB/frontend/src/routes/productRoutes.ts <- Ruta
import express, { Router, RequestHandler } from 'express';
import { addProduct, getProducts } from '../controllers/productController';
import Product from '../models/productModel';
import User from '../models/User';

const router: Router = express.Router();

router.post('/add', addProduct as RequestHandler);
router.get('/get', getProducts as RequestHandler);

router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category'); // Obtener categorías únicas
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});



export default router;