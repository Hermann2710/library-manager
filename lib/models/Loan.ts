import mongoose, { Schema, model, models } from "mongoose";

export interface ILoan {
  _id: string;
  item: mongoose.Types.ObjectId;    // L'exemplaire précis
  member: mongoose.Types.ObjectId;  // Le lecteur (fiche Member)
  librarian: mongoose.Types.ObjectId; // Le bibliothécaire qui a validé
  borrowDate: Date;                 // Date de sortie
  dueDate: Date;                    // Date de retour prévue
  returnDate?: Date;                // Date de retour réelle
  status: "Active" | "Returned" | "Overdue";
  notes?: string;
}

const LoanSchema = new Schema<ILoan>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  member: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  librarian: { type: Schema.Types.ObjectId, ref: "User", required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ["Active", "Returned", "Overdue"], 
    default: "Active" 
  },
  notes: { type: String },
}, { timestamps: true });

export const Loan = models.Loan || model<ILoan>("Loan", LoanSchema);