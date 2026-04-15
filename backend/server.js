import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow requests from the Next.js frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "🧠 Synapse API is running...",
    status: "healthy",
    version: "1.0.0",
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Synapse server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});