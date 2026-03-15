import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

const GenreSchema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Category = models.Category || model("Category", CategorySchema);
export const Genre = models.Genre || model("Genre", GenreSchema);