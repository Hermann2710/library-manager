import mongoose, { Schema, model, models } from "mongoose";

export interface INotification {
  _id: string;
  recipient: mongoose.Types.ObjectId;   // L'utilisateur qui reçoit
  recipientRole?: "reader" | "librarian" | "admin"; // Pour les notifications de groupe
  sender?: mongoose.Types.ObjectId;      // L'utilisateur qui a déclenché (optionnel)
  title: string;
  message: string;
  type: "loan" | "reminder" | "system" | "inventory"; 
  priority: "low" | "medium" | "high";
  isRead: boolean;
  link?: string;                         // Lien vers l'action (ex: /dashboard/loans/ID)
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  // Si null et que recipientRole est présent, c'est une notification de groupe
  recipient: { type: Schema.Types.ObjectId, ref: "User" },
  recipientRole: { 
    type: String, 
    enum: ["reader", "librarian", "admin"] 
  },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["loan", "reminder", "system", "inventory"], 
    default: "system" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "low" 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String },
}, { timestamps: true });

// Index pour accélérer la récupération des notifications non lues
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ recipientRole: 1, isRead: 1 });

export const Notification = models.Notification || model<INotification>("Notification", NotificationSchema);