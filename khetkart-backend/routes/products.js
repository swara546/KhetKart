// routes/products.js
const express  = require("express");
const router   = express.Router();
const Product  = require("../models/Product");
const { protect, farmerOnly } = require("../middleware/auth");

// GET /api/products — public, anyone can browse crops
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    let sortOption = {};
    if (sort === "price-asc")  sortOption = { price:  1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "name-asc")   sortOption = { name:   1 };

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/products/:id — public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Crop not found." });
    res.status(200).json(product);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/products — farmers only, list a new crop
router.post("/", protect, farmerOnly, async (req, res) => {
  try {
    const { name, description, price, unit, category, image, stock, minOrder } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }
    const product = await Product.create({
      name, description, price, unit, category, image, stock, minOrder,
      seller:     req.user._id,
      sellerName: req.user.name,
    });
    res.status(201).json({ message: "Crop listed successfully!", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/products/:id — farmer edits their own listing
router.put("/:id", protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Crop not found." });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own listings." });
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: "Listing updated!", product: updated });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// DELETE /api/products/:id — farmer deletes their own listing
router.delete("/:id", protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Crop not found." });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Listing removed successfully." });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;