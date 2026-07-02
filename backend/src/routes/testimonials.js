const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/testimonials — Public
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("testimonials").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// POST /api/testimonials — Admin
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("testimonials").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Testimonial created" });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

// PUT /api/testimonials/:id — Admin
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("testimonials").doc(req.params.id).update(req.body);
    res.json({ message: "Testimonial updated" });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

// DELETE /api/testimonials/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("testimonials").doc(req.params.id).delete();
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

module.exports = router;
