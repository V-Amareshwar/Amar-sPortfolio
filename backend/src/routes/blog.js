const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/blog — Public
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("blog").get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// POST /api/blog — Admin
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("blog").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Blog post created" });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// PUT /api/blog/:id — Admin
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("blog").doc(req.params.id).update(req.body);
    res.json({ message: "Blog post updated" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// DELETE /api/blog/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("blog").doc(req.params.id).delete();
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

module.exports = router;
