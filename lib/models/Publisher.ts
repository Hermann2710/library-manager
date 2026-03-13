import { Schema, model, models } from "mongoose";

export interface IPublisher {
  _id: string;
  name: string;
  address?: string;
  website?: string;
  email?: string;
  createdAt: Date;
}

const PublisherSchema = new Schema<IPublisher>({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  website: { type: String },
  email: { type: String },
}, { timestamps: true });

export const Publisher = models.Publisher || model<IPublisher>("Publisher", PublisherSchema);