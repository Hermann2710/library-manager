import mongoose, { Schema, model, models } from "mongoose";

export interface ILocation {
  _id: string;
  name: string;        // ex: "Rayon A1", "Salle de lecture"
  description?: string;
  createdAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export const Location = models.Location || model<ILocation>("Location", LocationSchema);