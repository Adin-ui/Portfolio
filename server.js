import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Contact form route
app.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO messages(name, email, subject, message) VALUES($1,$2,$3,$4) RETURNING *",
            [name, email, subject, message]
        );

        res.status(200).json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));