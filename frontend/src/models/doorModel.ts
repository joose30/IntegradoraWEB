import mongoose from 'mongoose';

const doorSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceId: {
    type: String,
    required: true
  }
});

const DoorStatusModel = mongoose.model('DoorStatus', doorSchema);

export default DoorStatusModel;