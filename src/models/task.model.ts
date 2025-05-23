import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  taskId: string;
  originalFilename: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  originalMetadata: {
    width: number;
    height: number;
    mimetype: string;
    exif?: Record<string, any>;
  };
  processedAt?: Date;
  errorMessage?: string;
  versions: Array<{
    quality: 'low' | 'medium' | 'high';
    path: string;
    width: number;
    height: number;
    size: number;
  }>;
}

const TaskSchema = new Schema<ITask>({
  taskId: { type: String, required: true, unique: true },
  originalFilename: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], required: true },
  originalMetadata: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    mimetype: { type: String, required: true },
    exif: { type: Schema.Types.Mixed },
  },
  processedAt: { type: Date },
  errorMessage: { type: String },
  versions: [
    {
      quality: { type: String, enum: ['low', 'medium', 'high'], required: true },
      path: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      size: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<ITask>('Task', TaskSchema);