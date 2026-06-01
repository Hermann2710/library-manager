import mongoose, { Schema, model, models } from "mongoose";

export interface IItem {
  _id: string;
  work: mongoose.Types.ObjectId;      // L'œuvre parente
  barcode: string;                    // Code unique (ex: BC-0001)
  location: mongoose.Types.ObjectId;  // Où il est rangé
  status: "Available" | "Borrowed" | "Lost" | "Maintenance";
  condition: "New" | "Good" | "Worn" | "Damaged";
  notes?: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  work: { type: Schema.Types.ObjectId, ref: "Work", required: true },
  barcode: { type: String, required: true, unique: true },
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  status: { 
    type: String, 
    enum: ["Available", "Borrowed", "Lost", "Maintenance"], 
    default: "Available" 
  },
  condition: { 
    type: String, 
    enum: ["New", "Good", "Worn", "Damaged"], 
    default: "Good" 
  },
  notes: { type: String },
}, { timestamps: true });

ItemSchema.index({ status: 1 });
ItemSchema.index({ work: 1 });
ItemSchema.index({ location: 1 });

export const Item = models.Item || model<IItem>("Item", ItemSchema);
