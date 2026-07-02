const express = require("express");
const router = express.Router();
const { auth } = require("../config/firebase");

// POST /api/auth/verify — Verify a Firebase ID token
// The frontend sends the token after login, backend confirms it's valid
router.post("/verify", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
