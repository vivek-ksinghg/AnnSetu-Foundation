import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  number: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, default: "" },
  password: { type: String, required: true },
  aadhaar: { type: String, trim: true },
  pan: { type: String, trim: true },
  role: { type: String, enum: ["volunteer"], default: "volunteer" },
  approved: { type: Boolean, default: false },

  skills: [String],                  // e.g. ["delivery","cooking"]
  availability: { type: String, enum: ["weekdays", "weekends", "both"] },
  assignedAreas: [String],           // e.g. ["Indore", "Bhopal"]
}, { timestamps: true });

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);
 
