import mongoose, { Schema, model, models } from "mongoose";

export interface IAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  nationality?: string;
  birthDate?: Date;
  deathDate?: Date;
  createdAt: Date;
}

const AuthorSchema = new Schema<IAuthor>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String },
  nationality: { type: String },
  birthDate: { type: Date },
  deathDate: { type: Date },
}, { timestamps: true });

// Création d'un index de recherche sur le nom et le prénom
AuthorSchema.index({ firstName: 'text', lastName: 'text' });

export const Author = models.Author || model<IAuthor>("Author", AuthorSchema);