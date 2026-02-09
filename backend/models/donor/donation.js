import mongoose from "mongoose";


const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor", // reference to donor who donated
    required: true,
  },

  // Donation Type
  donationType: {
    type: String,
    enum: ["Food", "Money"],
    required: true,
  },

  // Food Donation Fields
  foodName: { type: String, trim: true },
  foodType: { type: String, enum: ["Veg", "Non-Veg"] },
  state: { type: String, enum: ["Cooked", "Raw"] },
  quantity: { type: Number },
  unit: { type: String, enum: ["Packets", "Kg", "Liters", "Plates"] },
 
  // Human-readable address (text form)
  address: { type: String, trim: true }, // 🟢 ADDED

  // GeoJSON location for nearby NGO search
  location: { // 🟢 CHANGED
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

  // Money Donation Fields
  amount: { type: Number }, // money donated
  paymentMethod: { type: String, enum: ["UPI", "Card", "NetBanking", "Cash", "Razorpay"] },
  transactionId: { type: String }, // legacy payment id field
  razorpayOrderId: { type: String, trim: true },
  razorpayPaymentId: { type: String, trim: true },
  paymentStatus: { type: String, enum: ["Created", "Success", "Failed"], default: "Created" },
  ngoName: { type: String, trim: true },

  // Tracking
  status: {
    type: String,
    enum: ["Pending", "Accepted", "PickedUp", "Delivered", "Rejected", "Completed", "In-Progress"],
    default: "Pending",
  },

  acceptedByNgo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    default: null,
  },
  acceptedByVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    default: null,
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🟢 ADDED: Required for geospatial queries like $near or $geoWithin
donationSchema.index({ location: "2dsphere" });

// Update updatedAt before saving
donationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
