


require("dotenv").config(); // Load environment variables

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("uploads"));

// Configure Multer to keep the original file name
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const fileUrl = `${process.env.BASE_URL || `http://${req.hostname}:${PORT}`}/${req.file.originalname}`;

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
