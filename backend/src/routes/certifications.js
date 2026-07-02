const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/certifications — Public
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("certifications").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

// POST /api/certifications — Admin
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("certifications").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Certification created" });
  } catch (error) {
    console.error("Error creating certification:", error);
    res.status(500).json({ error: "Failed to create certification" });
  }
});

// PUT /api/certifications/:id — Admin
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("certifications").doc(req.params.id).update(req.body);
    res.json({ message: "Certification updated" });
  } catch (error) {
    console.error("Error updating certification:", error);
    res.status(500).json({ error: "Failed to update certification" });
  }
});

// DELETE /api/certifications/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("certifications").doc(req.params.id).delete();
    res.json({ message: "Certification deleted" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    res.status(500).json({ error: "Failed to delete certification" });
  }
});

module.exports = router;
