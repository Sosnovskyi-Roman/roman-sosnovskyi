// backend/index.js
const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static("uploads"));

// Налаштування для збереження файлів
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Zear2023",
  port: 5432,
});

// Маршрут для завантаження файлів
app.post("/upload", upload.single("photo"), async (req, res) => {
  const { phone } = req.body;
  const photoPath = req.file.path;

  try {
    const result = await pool.query(
      "INSERT INTO photos (phone, path) VALUES ($1, $2) RETURNING *",
      [phone, photoPath]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// Маршрут для отримання фото за номером
app.get("/photo/:phone", async (req, res) => {
  const { phone } = req.params;

  try {
    const result = await pool.query("SELECT * FROM photos WHERE phone = $1", [
      phone,
    ]);
    if (result.rows.length > 0) {
      const photo = result.rows[0];
      res.sendFile(path.resolve(photo.path));
    } else {
      res.status(404).json({ error: "Photo not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve photo" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
