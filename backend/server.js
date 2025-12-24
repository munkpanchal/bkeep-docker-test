const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:5001"];

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, only allow specific origins
      // In production, allow configured origins or be more permissive
      if (
        allowedOrigins.some(
          (allowed) => origin === allowed || origin.startsWith(allowed)
        )
      ) {
        callback(null, true);
      } else if (isProduction) {
        // In production, be more permissive but log the origin
        console.log(`Allowing origin: ${origin}`);
        callback(null, true);
      } else {
        // In development, be strict
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Docker Test Backend API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/users", (req, res) => {
  res.json({
    users: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ],
  });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  res.json({
    message: "User created successfully",
    user: {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
    },
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
