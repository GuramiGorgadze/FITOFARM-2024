import mongoose from "mongoose";

// A rating is either about the company/site as a whole (productHandle === null)
// or about one specific product (productHandle === that product's handle).
const RatingSchema = new mongoose.Schema(
  {
    productHandle: { type: String, trim: true, default: null, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    stars: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
    comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
  },
  { timestamps: true },
);

RatingSchema.index({ productHandle: 1, createdAt: -1 });

export default mongoose.model("Rating", RatingSchema);
