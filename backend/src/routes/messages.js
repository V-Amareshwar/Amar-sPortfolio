const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// GET /api/messages — Admin only
router.get("/", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("messages").get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages — Public: anyone can submit a contact form
router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const docRef = await db.collection("messages").add(data);
    res.status(201).json({ id: docRef.id, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// PUT /api/messages/:id — Admin: mark as read/unread
router.put("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("messages").doc(req.params.id).update(req.body);
    res.json({ message: "Message updated" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
});

// DELETE /api/messages/:id — Admin
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("messages").doc(req.params.id).delete();
    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
