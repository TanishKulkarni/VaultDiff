import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { semanticDiff } from "./ml/semanticDiff.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

/**
 * Document analysis endpoint (Phase 3)
 */
app.post(
  "/api/analyze-docs",
  upload.fields([
    { name: "oldDoc", maxCount: 1 },
    { name: "newDoc", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files?.oldDoc || !req.files?.newDoc) {
      return res.status(400).json({
        error: "Both oldDoc and newDoc files are required",
      });
    }

    try {
      // 1️⃣ Read file buffers
      const oldDocBuffer = req.files.oldDoc[0].buffer;
      const newDocBuffer = req.files.newDoc[0].buffer;

      // 2️⃣ Convert to text
      const oldDocText = oldDocBuffer.toString("utf-8");
      const newDocText = newDocBuffer.toString("utf-8");

      // 3️⃣ Normalize text
      const normalizeText = (text) =>
        text
          .toLowerCase()
          .replace(/\r\n/g, "\n")
          .replace(/\n{2,}/g, "\n\n")
          .trim();

      const normalizedOld = normalizeText(oldDocText);
      const normalizedNew = normalizeText(newDocText);

      // 4️⃣ Split into clauses (blank lines OR single lines)
      const splitIntoClauses = (text) =>
        text
          .split(/\n\s*\n|\n/g)
          .map((clause) => clause.trim())
          .filter((clause) => clause.length > 0)
          .map((clause, index) => ({
            id: index + 1,
            text: clause,
          }));

      const oldDocClauses = splitIntoClauses(normalizedOld);
      const newDocClauses = splitIntoClauses(normalizedNew);

      // 5️⃣ Semantic Diff (ML)
      const diffs = await semanticDiff(oldDocClauses, newDocClauses);

      // 6️⃣ Return semantic diff
      res.json({
        diffs,
      });
    } catch (error) {
      console.error("Semantic diff error:", error);
      res.status(500).json({
        error: "Failed to analyze documents",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
