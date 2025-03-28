import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema({
    mensaje: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    },
    tipo: {
        type: String,
        enum: ['alarma', 'acceso', 'sistema'],
        default: 'sistema'
    },
    dispositivo: {
        type: String,
        default: 'puerta'
    }
});

registroSchema.index({ fecha: -1 }); // Índice para ordenar por fecha

const Registro = mongoose.model('Registro', registroSchema);
export default Registro;