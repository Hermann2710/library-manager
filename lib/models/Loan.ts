import mongoose, { Schema, model, models } from "mongoose";

export interface ILoan {
  _id: string;
  item: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  librarian?: mongoose.Types.ObjectId; // Optionnel maintenant
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "Pending" | "Active" | "Returned" | "Overdue"; // Ajout de Pending
  notes?: string;
}

const LoanSchema = new Schema<ILoan>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  member: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  // Retrait de required: true pour permettre la réservation en ligne
  librarian: { type: Schema.Types.ObjectId, ref: "User" }, 
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ["Pending", "Active", "Returned", "Overdue"], // Ajout de Pending ici
    default: "Pending" 
  },
  notes: { type: String },
}, { timestamps: true });

export const Loan = models.Loan || model<ILoan>("Loan", LoanSchema);