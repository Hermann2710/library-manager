import mongoose, { Schema, model, models } from "mongoose";

/**
 * Interface representing the User structure in TypeScript.
 * This ensures strict typing across the application.
 */
export interface IUser {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users (Google/GitHub)
  image?: string;
  role: "reader" | "librarian" | "admin";
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, "Please provide a name"] 
    },
    email: { 
      type: String, 
      required: [true, "Please provide an email"], 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String,
      // We don't make it required here to allow OAuth logins
    },
    image: { 
      type: String 
    },
    role: { 
      type: String, 
      enum: ["reader", "librarian", "admin"], 
      default: "reader" 
    },
  },
  { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
  }
);

UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

/**
 * Prevents Mongoose from recompiling the model during Next.js hot reloads.
 */
const User = models.User || model<IUser>("User", UserSchema);

export default User;
