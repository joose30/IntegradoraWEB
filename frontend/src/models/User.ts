import mongoose, { Document } from 'mongoose';

// Define una interfaz para el modelo User
export interface IUser extends Document {
  name: string;
  lastName: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  recoveryToken: string | null; // Permitir que sea string o null
  secretQuestion: string; // Nueva propiedad
  secretAnswer: string;   // Nueva propiedad
  fingerprint: string | null; // Nueva propiedad para la huella
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  recoveryToken: { type: String, default: null },
  secretQuestion: { type: String, required: true },
  secretAnswer: { type: String, required: true },
  fingerprint: { type: String, default: null }, // Nuevo campo para la huella
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;