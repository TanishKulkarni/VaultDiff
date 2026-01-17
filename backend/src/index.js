import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

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
 * Mock document analysis endpoint
 */
app.post(
    "/api/analyze-docs",
    upload.fields([
        { name: "oldDoc", maxCount: 1 },
        { name: "newDoc", maxCount: 1 },
    ]),
    (req, res) => {
      // For now just confirm files arrived
      if (!req.files?.oldDoc || !req.files?.newDoc){
        return res.status(400).json({
            error: "Both oldDoc and newDoc files are required",
        });
      }

      res.json({
        status: "ok",
      });
    }
);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});