const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/projects — Public: fetch all projects
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("projects").get();
    const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST /api/projects — Admin: create a new project
router.post("/", verifyToken, async (req, res) => {
  try {
    const docRef = await db.collection("projects").add(req.body);
    res.status(201).json({ id: docRef.id, message: "Project created" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:id — Admin: update a project
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("projects").doc(req.params.id).update(req.body);
    res.json({ message: "Project updated" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:id — Admin: delete a project
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("projects").doc(req.params.id).delete();
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
