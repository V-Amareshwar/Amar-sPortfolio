const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/skills — Public
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("skills").get();
    const skills = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// POST /api/skills — Admin
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("skills").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Skill created" });
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

// PUT /api/skills/:id — Admin
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("skills").doc(req.params.id).update(req.body);
    res.json({ message: "Skill updated" });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// DELETE /api/skills/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("skills").doc(req.params.id).delete();
    res.json({ message: "Skill deleted" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

module.exports = router;
