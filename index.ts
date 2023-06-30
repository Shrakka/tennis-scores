import express, { json } from "express";
import { computeScoreController } from "./src/computeScoreController";

const app = express();

app.post("/scores", json(), computeScoreController);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
