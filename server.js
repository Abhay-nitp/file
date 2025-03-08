// const express = require("express");
// const app = express();
// const port = 3000;
// const userdata = require("./MOCK_DATA.json");

// app.use(express.json()); // Middleware to parse JSON



// app.get("/users", (req, res) => {
//     const users = [
//         { id: 1, name: "Alice" },
//         { id: 2, name: "Bob" }
//     ];
//     res.json(users);
// });

// app.post("/users", (req, res) => {
//     const newUser = req.body;
//     newUser.id = Math.floor(Math.random() * 1000); // Assign random ID
//     res.status(201).json({ message: "User created", user: newUser });
// });

// app.put("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     const updatedUser = req.body;
//     updatedUser.id = userId;
//     res.json({ message: "User updated", user: updatedUser });
// });

// app.patch("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     const updates = req.body;
//     res.json({ message: `User ${userId} partially updated`, updates });
// });

// app.delete("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     res.json({ message: `User ${userId} deleted` });
// });


// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


// // const express = require('express');
// // const http = require('http');
// // const { Server } = require('socket.io');
// // const path = require('path');

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server);

// // app.use(express.static(path.join(__dirname, 'public')));

// // io.on('connection', (socket) => {
// //     console.log('A user connected');
    
// //     socket.on('chat message', (msg) => {
// //         io.emit('chat message', msg);
// //     });
    
// //     socket.on('disconnect', () => {
// //         console.log('A user disconnected');
// //     })
// // });

// // server.listen(3000, () => {
// //     console.log('Server running on http://localhost:3000');
// // });
// // const http = require("http");
// // const express = require("express");
// // const socketIo = require("socket.io");

// // const app = express();
// // const server = http.createServer(app);
// // const io = socketIo(server);

// // app.get("/", (req, res) => {
// //   res.sendFile(__dirname + "/index.html");
// // });

// // io.on("connection", (socket) => {
// //   console.log("A user connected");
// //   socket.on("disconnect", () => {
// //     console.log("User disconnected");
// //   });
// // });

// // server.listen(3000, () => {
// //   console.log("Server is running at http://localhost:3000");
// // });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const QRCode = require("qrcode");

const app = express();
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
    
    const fileUrl = `http://${req.hostname}:3000/${req.file.originalname}`;

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
app.listen(3000, () => {
    console.log("Server running on http://<your-laptop-ip>:3000");
});
