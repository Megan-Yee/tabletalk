const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Prefer not to say", "Other"],
      required: true,
    },
    age: { type: Number, min: 1, max: 99, required: true },
    budget: {
      type: [String],
      enum: ["$", "$$", "$$$", "$$$$"],
      required: true,
    },
    personalityType: {
      type: String,
      enum: [
        "INTJ","INTP","ENTJ","ENTP",
        "INFJ","INFP","ENFJ","ENFP",
        "ISTJ","ISFJ","ESTJ","ESFJ",
        "ISTP","ISFP","ESTP","ESFP",
      ],
      required: true,
    },
    hobbies: {
      type: [String],
      enum: [
        "Hiking","Gaming","Cooking","Reading","Traveling",
        "Photography","Music","Art & Drawing","Fitness",
        "Yoga & Meditation","Dancing","Cycling","Swimming",
        "Board Games","Movies & TV","Volunteering","Sports",
        "Gardening","Writing","Coding",
      ],
      default: [],
    },
    allergies: {
      type: [String],
      enum: [
        "None","Milk","Eggs","Fish","Shellfish",
        "Tree Nuts","Peanuts","Wheat","Soybeans","Sesame",
      ],
      default: ["None"],
    },
    organizations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organization" }],
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
