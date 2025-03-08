


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const QRCode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer-Storage-Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Cloudinary folder name
        format: async (req, file) => "png", // Convert all files to PNG
        public_id: (req, file) => file.originalname.split(".")[0], // Use original file name
    },
});
const upload = multer({ storage });

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = req.file.path;

    // Generate QR Code
    QRCode.toDataURL(fileUrl, (err, qrCode) => {
        if (err) {
            return res.status(500).send("Error generating QR Code");
        }

        res.send(`
            <h2>File uploaded successfully!</h2>
            <p><a href="${fileUrl}" target="_blank">Download File</a></p>
            <h3>Scan QR Code to Download:</h3>
            <img src="${qrCode}" alt="QR Code">
        `);
    });
});
const path = require("path");

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
