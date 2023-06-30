import express from "express";
import { computeScoreController } from "./src/computeScoreController";

// Create app
const app = express();

// Body parsers
app.use(express.json());

// Serve front files
app.use(express.static("public"));

// API Routes
app.post("/scores", computeScoreController);


// Start app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
