import express from "express";
import { computeScoreController } from "./computeScoreController";

// Create app
export const app = express();

// Body parsers
app.use(express.json());

// Serve front files
app.use(express.static("client/dist"));

// API Routes
app.post("/api/scores", computeScoreController);
