import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  walletAddress: { type: String, required: true, unique: true, index: true, lowercase: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, required: true, enum: ['buyer', 'seller', 'verifier', 'admin'] },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  profile: {
    organizationName: { type: String }
  },
  kycStatus: { type: String, enum: ['NotStarted', 'Pending', 'Approved', 'Rejected'], default: 'NotStarted' }
}, { strict: false });

export default mongoose.models.User || mongoose.model('User', userSchema);
