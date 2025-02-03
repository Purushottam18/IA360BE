const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();
const { default: mongoose } = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//Video upload to drive

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json", 
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

router.post("/upload", upload.single("video"), async (req, res) => {
  const { projectName, floorName, timestamp } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!projectName || !floorName || !timestamp) {
    return res.status(400).json({ error: "Missing project name, floor name, or timestamp" });
  }

  try {
    // Get the correct file path
    const filePath = req.file.path;

    const fileMetadata = {
      name: req.file.originalname, // Keep the filename as received
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath), // Read file from disk properly
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File ID:", response.data.id);
    console.log("File Link:", `https://drive.google.com/file/d/${response.data.id}/view`);

    // Remove the uploaded file from the local server storage
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      link: `https://drive.google.com/file/d/${response.data.id}/view`,
    });
  } catch (error) {
    console.error("Google Drive Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});
module.exports = router;
