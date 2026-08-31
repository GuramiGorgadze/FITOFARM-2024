import mongoose from "mongoose";

const translationSchema = new mongoose.Schema(
  {
    en: { type: String, trim: true },
    ru: { type: String, trim: true },
    de: { type: String, trim: true },
    ka: { type: String, trim: true },
  },
  { _id: false },
);

const translationArraySchema = new mongoose.Schema(
  {
    en: { type: [String], default: [] },
    ru: { type: [String], default: [] },
    de: { type: [String], default: [] },
    ka: { type: [String], default: [] },
  },
  { _id: false },
);

const brandNameLangSchema = new mongoose.Schema(
  {
    primary: { type: String, trim: true },
    secondary: { type: String, trim: true },
  },
  { _id: false },
);

const brandNameSchema = new mongoose.Schema(
  {
    ka: { type: brandNameLangSchema },
    en: { type: brandNameLangSchema },
    ru: { type: brandNameLangSchema },
    de: { type: brandNameLangSchema },
  },
  { _id: false },
);

const characteristicsSchema = new mongoose.Schema(
  {
    pharmacologicalGroup: { type: translationSchema },
    manufacturerCountry: { type: translationSchema },
    manufacturer: { type: translationSchema },
    dispensingForm: { type: translationSchema },
    status: { type: translationSchema },
    activeSubstance: { type: translationArraySchema },
    dosage: { type: translationSchema },
  },
  { _id: false },
);

const annotationTableSchema = new mongoose.Schema(
  {
    columns: { type: [String], default: [] },
    rows: { type: [[String]], default: [] },
    footnotes: { type: [String], default: [] },
  },
  { _id: false },
);

const annotationSectionSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    text: { type: String, trim: true },
    list: { type: [String], default: [] },
    table: { type: annotationTableSchema },
  },
  { _id: false },
);

const annotationLangSchema = new mongoose.Schema(
  {
    category: { type: String, trim: true },
    form: { type: String, trim: true },
    lead: { type: String, trim: true },
    sections: { type: [annotationSectionSchema], default: [] },
  },
  { _id: false },
);

const fullAnnotationSchema = new mongoose.Schema(
  {
    ka: { type: annotationLangSchema },
    en: { type: annotationLangSchema },
    de: { type: annotationLangSchema },
    ru: { type: annotationLangSchema },
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true, trim: true },
    title: { type: translationSchema, required: true },
    brandName: { type: brandNameSchema },
    characteristics: { type: characteristicsSchema },
    shortDescription: { type: translationSchema },
    fullAnnotation: { type: fullAnnotationSchema },
    images: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Product", ProductSchema);
