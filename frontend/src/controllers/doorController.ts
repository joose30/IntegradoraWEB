import { Request, Response } from 'express';
import DoorStatus from '../models/doorModel';

// Registrar estado de la puerta
export const registerDoorStatus = async (req: Request, res: Response) => {
  try {
    const { status, deviceId } = req.body;
    
    if (!status || !deviceId) {
      return res.status(400).json({ error: 'Status and deviceId are required' });
    }

    const newStatus = new DoorStatus({
      status,
      deviceId
    });

    await newStatus.save();

    res.status(201).json(newStatus);
  } catch (error) {
    console.error('Error registering door status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Obtener el último estado de la puerta
export const getLastDoorStatus = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    
    const lastStatus = await DoorStatus.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!lastStatus) {
      return res.status(404).json({ error: 'No status found for this device' });
    }

    res.status(200).json(lastStatus);
  } catch (error) {
    console.error('Error getting door status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Manejar cambio de estado desde Arduino
export const handleStatusChange = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const deviceId = req.headers['x-device-id'] || req.ip;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const newStatus = new DoorStatus({
      status,
      deviceId
    });

    await newStatus.save();

    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error handling status change:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};