import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  due: { type: Date },
  status: { type: String, required: true, default: 'open' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
});

export const taskModel = mongoose.model('Task', taskSchema, 'task');