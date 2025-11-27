import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: string;       // Sender username
  to: string;         // Receiver username
  text: string;       // Message content
  createdAt: Date;    // Timestamp
}

const MessageSchema: Schema<IMessage> = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
