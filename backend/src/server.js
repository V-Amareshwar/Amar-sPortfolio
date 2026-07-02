require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// CORS: allow the frontend to call us
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const profileRoutes = require("./routes/profile");
const projectsRoutes = require("./routes/projects");
const skillsRoutes = require("./routes/skills");
const achievementsRoutes = require("./routes/achievements");
const certificationsRoutes = require("./routes/certifications");
const blogRoutes = require("./routes/blog");
const testimonialsRoutes = require("./routes/testimonials");
const messagesRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
