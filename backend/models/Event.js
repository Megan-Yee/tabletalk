const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    startTime: { type: String, default: "" }, // e.g. "10:00 AM"
    endTime: { type: String, default: "" },
    location: { type: String, default: "" },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
