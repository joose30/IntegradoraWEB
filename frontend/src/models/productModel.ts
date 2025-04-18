// IntegradoraWEB/frontend/src/models/productModel.ts <- Ruta
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Asegúrate de que este campo esté presente
});

const Product = mongoose.model('Product', productSchema);

export default Product;