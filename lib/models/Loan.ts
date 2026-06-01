import mongoose, { Schema, model, models } from "mongoose";

export interface ILoan {
  _id: string;
  item: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  librarian?: mongoose.Types.ObjectId; // Optionnel maintenant
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "Pending" | "Active" | "Returned" | "Overdue" | "Rejected";
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
    enum: ["Pending", "Active", "Returned", "Overdue", "Rejected"],
    default: "Pending" 
  },
  notes: { type: String },
}, { timestamps: true });

LoanSchema.index({ status: 1, dueDate: 1 });
LoanSchema.index({ member: 1, status: 1, dueDate: 1 });
LoanSchema.index({ item: 1, status: 1 });
LoanSchema.index({ updatedAt: 1 });

export const Loan = models.Loan || model<ILoan>("Loan", LoanSchema);
