import mongoose, { Schema, model, models } from "mongoose";

export interface IWork {
  _id: string;
  title: string;
  description?: string;
  isbn?: string;
  language: string;
  publishDate?: Date;
  publisher: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  genres: mongoose.Types.ObjectId[];
  authors: mongoose.Types.ObjectId[];
  coverImage?: string;
  createdAt: Date;
}

const WorkSchema = new Schema<IWork>({
  title: { type: String, required: true },
  description: { type: String },
  isbn: { type: String, unique: true, sparse: true },
  language: { type: String, default: "Anglais" },
  publishDate: { type: Date },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  authors: [{ type: Schema.Types.ObjectId, ref: "Author", required: true }],
  coverImage: { type: String },
}, { timestamps: true });

// Index pour la recherche textuelle sur le titre
WorkSchema.index({ title: 'text' }, { language_override: 'dummy' });

export const Work = models.Work || model<IWork>("Work", WorkSchema);