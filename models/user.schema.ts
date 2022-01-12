import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  telegram: { type: String },
  role: {
    type: String,
    enum: ['superadmin', 'leader', 'budak'],
    default: 'budak',
    required: true
  },
});

export const userModel = mongoose.model('User', userSchema, 'user');