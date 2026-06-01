import mongoose, { Schema, model, models } from "mongoose";

export interface IMember {
  _id: string;
  user: mongoose.Types.ObjectId;      // Référence au compte User
  memberId: string;                   // Identifiant bibliothécaire (ex: MEM-2026-001)
  phone: string;
  address?: string;
  status: "Active" | "Inactive" | "Banned";
  membershipExpiresAt: Date;
  createdAt: Date;
}

const MemberSchema = new Schema<IMember>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  memberId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  status: { 
    type: String, 
    enum: ["Active", "Inactive", "Banned"], 
    default: "Active" 
  },
  membershipExpiresAt: { type: Date, required: true },
}, { timestamps: true });

MemberSchema.index({ status: 1 });
MemberSchema.index({ createdAt: 1 });

export const Member = models.Member || model<IMember>("Member", MemberSchema);
