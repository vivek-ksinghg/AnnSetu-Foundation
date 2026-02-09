// import mongoose from "mongoose";

// const certificateSchema = new mongoose.Schema({
//   donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
//   ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
//   // donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },

//   donorName: { type: String, required: true },
//   // donationType: { type: String, enum: ["money", "food"], required: true },

//     totalFoodKg: { type: Number, default: 0 },
//   totalMoney: { type: Number, default: 0 },

//     fromDate: { type: Date, required: true },
//     toDate: { type: Date, required: true },

//   // amount: Number,
//   location: String,
//   certificateUrl: { type: String, required: true },
//   // date: { type: Date, default: Date.now }
// }, { timestamps: true });

// export default mongoose.model("Certificate", certificateSchema);
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: false, // optional agar global certificate hai
    },
    donorName: {
      type: String,
      required: true,
    },
    donationType: {
      type: String,
      enum: ["food_money"],
      required: true,
    },
    totalFoodKg: {
      type: Number,
      default: 0,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    foodSummary: [
      {
        foodName: { type: String, trim: true },
        quantity: { type: Number, default: 0 },
        unit: { type: String, trim: true },
      },
    ],
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: "India",
    },
    certificateUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
