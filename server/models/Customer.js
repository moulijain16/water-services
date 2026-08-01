const mongoose = require("mongoose");

const serviceEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    serviceType: {
      type: String,
      enum: ["installation", "regular", "repair", "filter-change", "other"],
      default: "regular",
    },
    partsReplaced: { type: String, default: "" },
    notes: { type: String, default: "" },
    chargedAmount: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"],
    },
    email: { type: String, trim: true, lowercase: true, default: "" },
    address: { type: String, required: [true, "Address is required"], trim: true },
    purifierModel: { type: String, trim: true, default: "" },
    installationDate: { type: Date, default: Date.now },
    lastServiceDate: { type: Date, default: Date.now },
    nextServiceDate: { type: Date },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: "" },
    serviceHistory: [serviceEntrySchema],
  },
  { timestamps: true }
);

customerSchema.pre("save", function () {
  if (this.isModified("lastServiceDate") || this.isNew) {
    const months = Number(process.env.SERVICE_INTERVAL_MONTHS) || 3;
    const next3Months = new Date(this.lastServiceDate);
    next3Months.setMonth(next3Months.getMonth() + months);
    this.nextServiceDate = next3Months;
  }
});

customerSchema.virtual("isDue").get(function () {
  return this.nextServiceDate ? new Date() >= this.nextServiceDate : false;
});
customerSchema.set("toJSON", { virtuals: true });

// Search index now scoped alongside owner for efficient per-user queries
customerSchema.index({ owner: 1, name: "text", phone: "text", address: "text" });

module.exports = mongoose.model("Customer", customerSchema);