// routes/products.js
// GET    /api/products         → get all products (public)
// GET    /api/products/:id     → get one product (public)
// POST   /api/products         → add product (sellers only)
// PUT    /api/products/:id     → update product (seller who owns it)
// DELETE /api/products/:id     → delete product (seller who owns it)

const express   = require("express");
const router    = express.Router();
const Product   = require("../models/Product");
const { protect, sellerOnly } = require("../middleware/auth");

// ────────────────────────────────────────────────────────────────
// GET /api/products
// Public — anyone can browse products
// Supports: ?category=Seeds  ?search=wheat  ?sort=price-asc
// ────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    // Build filter object
    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      // Search in name OR description (case-insensitive)
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    let sortOption = {};
    if (sort === "price-asc")  sortOption = { price:  1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "name-asc")   sortOption = { name:   1 };

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/products/:id
// Public — get a single product by ID
// ────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// POST /api/products
// Protected — only logged-in sellers can add products
// Body: { name, description, price, unit, category, image, stock, brand }
// ────────────────────────────────────────────────────────────────
router.post("/", protect, sellerOnly, async (req, res) => {
  try {
    const { name, description, price, unit, category, image, stock, brand } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      unit,
      category,
      image,
      stock,
      brand,
      seller:     req.user._id,    // from JWT token
      sellerName: req.user.name,
    });

    res.status(201).json({ message: "Product added successfully!", product });

  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// PUT /api/products/:id
// Protected — seller can only edit their own products
// ────────────────────────────────────────────────────────────────
router.put("/:id", protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Make sure this seller owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own products." });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc
    );

    res.status(200).json({ message: "Product updated!", product: updated });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// DELETE /api/products/:id
// Protected — seller can only delete their own products
// ────────────────────────────────────────────────────────────────
router.delete("/:id", protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products." });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
