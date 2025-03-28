import mongoose from 'mongoose';

const fingerprintSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Fingerprint = mongoose.model('Fingerprint', fingerprintSchema);

export default Fingerprint;