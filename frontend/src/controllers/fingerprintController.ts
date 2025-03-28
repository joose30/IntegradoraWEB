import { Request, Response } from 'express';
import Fingerprint from '../models/Fingerprint';

// fingerprintController.ts
export const registerFingerprint = async (req: Request, res: Response) => {
  try {
    // En vez de 'id', tomamos 'fingerprint_id'
    const { fingerprint_id } = req.body;

    // Guardamos en la base de datos con la propiedad 'id'
    const newFingerprint = new Fingerprint({ id: fingerprint_id });
    await newFingerprint.save();

    res.status(201).json(newFingerprint);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la huella' });
  }
};




export const listFingerprints = async (req: Request, res: Response) => {
  try {
    const fingerprints = await Fingerprint.find(); // Busca todos los documentos en la colección
    res.status(200).json(fingerprints); // Devuelve los datos en formato JSON
  } catch (error) {
    res.status(500).json({ error: 'Error al listar las huellas' });
  }
};