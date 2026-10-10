import Ratings from "../models/ratings.js";
import Products from "../models/products.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 6;

// "" / undefined / "site" -> null (site-wide ratings). Anything else is a product handle.
const normalizeHandle = (value) => {
  if (typeof value !== "string") return null;
  const handle = value.trim();
  return handle && handle !== "site" ? handle : null;
};

const round1 = (n) => Math.round(n * 10) / 10;

const emptySummary = { average: 0, count: 0 };

// GET /api/ratings?product=<handle>&page=1&limit=6
// No `product` -> site-wide ratings. Newest first.
export const getRatings = async (req, res) => {
  try {
    const productHandle = normalizeHandle(req.query.product);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

    const filter = { productHandle };

    const [ratings, total] = await Promise.all([
      Ratings.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("name stars comment createdAt")
        .lean(),
      Ratings.countDocuments(filter),
    ]);

    res.status(200).json({
      data: ratings,
      meta: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" });
  }
};

// GET /api/ratings/summary?product=<handle>  ->  { average, count }
// No `product` -> site-wide summary.
export const getRatingSummary = async (req, res) => {
  try {
    const productHandle = normalizeHandle(req.query.product);

    const [row] = await Ratings.aggregate([
      { $match: { productHandle } },
      { $group: { _id: null, average: { $avg: "$stars" }, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      data: row ? { average: round1(row.average), count: row.count } : emptySummary,
    });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" });
  }
};

// GET /api/ratings/summaries  ->  { data: { "<handle>": { average, count }, ... } }
// One request for every product, so the products grid doesn't fire N requests.
export const getProductSummaries = async (req, res) => {
  try {
    const rows = await Ratings.aggregate([
      { $match: { productHandle: { $ne: null } } },
      { $group: { _id: "$productHandle", average: { $avg: "$stars" }, count: { $sum: 1 } } },
    ]);

    const data = {};
    rows.forEach((row) => {
      data[row._id] = { average: round1(row.average), count: row.count };
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" });
  }
};

// POST /api/ratings   body: { name, stars, comment, productHandle? }
export const createRating = async (req, res) => {
  try {
    const { name, stars, comment } = req.body;
    const productHandle = normalizeHandle(req.body.productHandle);

    const starsNum = Number(stars);
    if (!Number.isInteger(starsNum) || starsNum < 1 || starsNum > 5) {
      return res.status(400).json({ err: "Stars must be a whole number from 1 to 5" });
    }
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ err: "Name is required" });
    }
    if (typeof comment !== "string" || comment.trim().length < 3) {
      return res.status(400).json({ err: "Comment is required" });
    }

    if (productHandle) {
      const exists = await Products.exists({ handle: productHandle });
      if (!exists) {
        return res.status(404).json({ err: "Product not found" });
      }
    }

    const rating = await Ratings.create({
      productHandle,
      name: name.trim().slice(0, 60),
      stars: starsNum,
      comment: comment.trim().slice(0, 1000),
    });

    res.status(201).json({
      data: {
        _id: rating._id,
        name: rating.name,
        stars: rating.stars,
        comment: rating.comment,
        createdAt: rating.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ err: "Invalid rating data" });
    }
    res.status(500).json({ err: "Something went wrong" });
  }
};

// DELETE /api/ratings/:id   (admin only) - for removing spam / abusive entries
export const deleteRating = async (req, res) => {
  try {
    const deleted = await Ratings.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ err: "Rating not found" });
    }
    res.status(200).json({ data: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" });
  }
};
