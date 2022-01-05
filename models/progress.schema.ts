import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  desc: { type: String, required: true, }
});

export const progressModel = mongoose.model('Progress', progressSchema, 'progress');