import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriberDocument extends Document {
  email: string;
  source: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String, default: 'homepage-footer' },
  },
  { timestamps: true }
);

export const SubscriberModel: Model<ISubscriberDocument> =
  mongoose.models.Subscriber || mongoose.model<ISubscriberDocument>('Subscriber', SubscriberSchema);
