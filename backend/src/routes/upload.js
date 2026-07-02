const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/auth");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// POST /api/upload — Admin: upload a file to Supabase Storage
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + "-" + req.file.originalname.replace(/\s+/g, "_");

    // Upload to Supabase bucket 'portfolio-images'
    const { data, error } = await supabase.storage
      .from("portfolio-images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return res.status(500).json({ error: "Failed to upload to Supabase" });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(fileName);

    res.json({ url: publicUrlData.publicUrl, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// DELETE /api/upload — Admin: delete a file from Supabase Storage
router.delete("/", verifyToken, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: "No fileUrl provided" });
    }

    // Extract filename from the Supabase public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/portfolio-images/<filename>
    const bucketPath = "/portfolio-images/";
    const index = fileUrl.indexOf(bucketPath);
    if (index === -1) {
      return res.status(400).json({ error: "Invalid Supabase file URL" });
    }
    const fileName = decodeURIComponent(fileUrl.substring(index + bucketPath.length));

    const { error } = await supabase.storage
      .from("portfolio-images")
      .remove([fileName]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({ error: "Failed to delete from Supabase" });
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
