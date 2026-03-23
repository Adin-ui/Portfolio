import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Test route
app.get("/api", (req, res) => {
    res.send("API is running");
});

// Contact form route
app.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        await pool.query(
            "INSERT INTO messages(name, email, subject, message) VALUES($1,$2,$3,$4)",
            [name, email, subject, message]
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// Open index.html when site loads
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));