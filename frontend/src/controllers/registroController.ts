import { Request, Response } from 'express';
import Registro from '../models/registroModel';

export const getRegistros = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;
        const registros = await Registro.find({})
            .sort({ fecha: -1 })
            .limit(limit);
            
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al obtener registros:', error);
        res.status(500).json({ 
            message: 'Error al obtener los registros',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const addRegistro = async (req: Request, res: Response) => {
    try {
        const { mensaje, descripcion } = req.body;
        const newRegistro = new Registro({ 
            mensaje, 
            descripcion,
            tipo: 'sistema',
            dispositivo: 'puerta'
        });
        
        await newRegistro.save();
        res.status(201).json(newRegistro);
    } catch (error) {
        console.error('Error al agregar registro:', error);
        res.status(500).json({ 
            message: 'Error al agregar el registro',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const getUltimosRegistros = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const registros = await Registro.find({})
            .sort({ fecha: -1 })
            .limit(limit);
            
        res.status(200).json(registros);
    } catch (error) {
        console.error('Error al obtener últimos registros:', error);
        res.status(500).json({ 
            message: 'Error al obtener últimos registros',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};