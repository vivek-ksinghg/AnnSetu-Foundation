import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  organizationName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  number: { type: String, required: true },
  // Human-readable address (text form)
  address: { type: String, trim: true }, // 🟢 ADDED
  password: { type: String, required: true },

  registrationNumber: { type: String, required: true },
  mission: { type: String },
  website: { type: String },
  contactPerson: { type: String },
    role: {
    type: String,
    default: "ngo",  // ✅ important
    enum: ["ngo"]
  },
  approved: { type: Boolean, default: false },

    location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },



  // Certificates issued to donors
  issuedCertificates: [
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
      donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
      certificateUrl: String,
      issuedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

ngoSchema.index({ location: "2dsphere" });

export default mongoose.model("NGO", ngoSchema);
