import { Request, Response } from 'express';
import Device from '../models/Device';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

/**
 * Registrar un nuevo dispositivo IoT asociado al usuario autenticado
 */
export const registerDevice = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { macAddress, name, devicePin } = req.body;

        // Validación para campos requeridos
        if (!macAddress || !name) {
            return res.status(400).json({ message: 'La dirección MAC y el nombre son requeridos' });
        }

        // Validación para el PIN
        if (!devicePin || devicePin.length !== 4 || !/^\d{4}$/.test(devicePin)) {
            return res.status(400).json({ message: 'El PIN debe ser de exactamente 4 dígitos' });
        }

        // Verificar si el dispositivo ya existe
        const deviceExists = await Device.findOne({ macAddress });
        if (deviceExists) {
            return res.status(400).json({ message: 'Este dispositivo ya está registrado' });
        }

        // Asegurarse de que req.user exista y tenga id
        if (!req.user || !req.user.id) {
            console.error('Usuario no disponible en el request:', req.user);
            return res.status(401).json({ message: 'Usuario no identificado' });
        }

        // Información para depuración
        console.log('Datos para crear dispositivo:', {
            userId: req.user.id,
            macAddress,
            name,
            devicePin
        });

        // Crear el nuevo dispositivo
        const device = await Device.create({
            userId: req.user.id,
            macAddress,
            name
        });

        console.log('Dispositivo creado:', device);

        // Actualizar el PIN en el documento del usuario
        await User.findByIdAndUpdate(req.user.id, { devicePin });
        console.log(`PIN actualizado para el usuario ${req.user.id}`);

        // Responder con éxito
        res.status(201).json({
            message: 'Dispositivo registrado exitosamente y PIN configurado',
            device
        });
    } catch (error: any) {
        // Mejorar el logging de errores
        console.error('Error al registrar dispositivo:', error);

        // Respuesta detallada
        res.status(500).json({
            message: 'Error al registrar dispositivo',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

/**
 * Obtener todos los dispositivos IoT
 */
export const getDevices = async (req: Request, res: Response) => {
    try {
        const devices = await Device.find().populate('userId', 'email name');
        res.status(200).json(devices);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener dispositivos', details: error.message });
    }
};

/**
 * Obtener todos los dispositivos asociados a un usuario autenticado
 */
export const getUserDevices = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        // Buscar dispositivos asociados al usuario
        const devices = await Device.find({ userId });

        // Transformar los datos para incluir isConfigured
        const transformedDevices = devices.map(device => {
            const deviceObj = device.toObject();
            return {
                ...deviceObj,
                isConfigured: !!deviceObj.name
            };
        });

        res.status(200).json(transformedDevices);
    } catch (error) {
        console.error('Error al obtener dispositivos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Obtener información de un dispositivo específico
 */
export const getDeviceInfo = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { deviceId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const device = await Device.findOne({
            _id: deviceId,
            userId
        });

        if (!device) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }

        res.status(200).json(device);
    } catch (error) {
        console.error('Error al obtener información del dispositivo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};