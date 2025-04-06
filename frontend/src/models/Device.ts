import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
    userId: mongoose.Types.ObjectId;
    macAddress: string;
    name: string;
    location?: string;
    isOnline?: boolean;
    lastConnection?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DeviceSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    macAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true}); // Mantén los timestamps para createdAt y updatedAt

const Device = mongoose.model<IDevice>('Device', DeviceSchema);

export default Device;