import mongoose from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },

    passwordChangeAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

// Query Middleware
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.static(
  "isUserExistByCustomEmail",
  async function isUserExistByCustomEmail(email: string) {
    const existingUser = await User.findOne({ email }).select("+password");
    return existingUser;
  }
);

userSchema.statics.isDeleted = async function (email: string) {
  return await User.findOne({ email, isDeleted: true });
};
userSchema.statics.isValidPassword = async function (
  password: string,
  hashPassword: string
) {
  return await bcrypt.compare(password, hashPassword);
};
userSchema.statics.isJWTTokenIssuedBeforePassword = async function (
  issuedAt: number,
  passwordChangeAt: Date
) {
  const passwordChangedTime = new Date(passwordChangeAt).getTime() / 1000;
  return issuedAt < passwordChangedTime;
};

export const User = mongoose.model<TUser, UserModel>("User", userSchema);
