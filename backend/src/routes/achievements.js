const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/achievements — Public
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("achievements").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

// POST /api/achievements — Admin
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("achievements").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Achievement created" });
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).json({ error: "Failed to create achievement" });
  }
});

// PUT /api/achievements/:id — Admin
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("achievements").doc(req.params.id).update(req.body);
    res.json({ message: "Achievement updated" });
  } catch (error) {
    console.error("Error updating achievement:", error);
    res.status(500).json({ error: "Failed to update achievement" });
  }
});

// DELETE /api/achievements/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("achievements").doc(req.params.id).delete();
    res.json({ message: "Achievement deleted" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    res.status(500).json({ error: "Failed to delete achievement" });
  }
});

module.exports = router;
