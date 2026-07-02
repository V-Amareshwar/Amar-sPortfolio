const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/profile — Public: fetch the main profile document
router.get("/", async (req, res) => {
  try {
    const doc = await db.collection("profile").doc("main").get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile — Admin: update profile
router.put("/", verifyToken, async (req, res) => {
  try {
    await db.collection("profile").doc("main").set(req.body, { merge: true });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
