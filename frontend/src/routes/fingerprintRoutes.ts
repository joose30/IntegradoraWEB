import express from 'express';
import { registerFingerprint, listFingerprints } from '../controllers/fingerprintController';

const router = express.Router();

router.post('/register', registerFingerprint);
router.get('/list', listFingerprints);

export default router;