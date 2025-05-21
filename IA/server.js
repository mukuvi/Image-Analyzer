import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import "dotenv/config";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.static(path.join(process.cwd(), "/")));

const API_KEY = process.env.API_KEY;

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = await fs.readFile(imagePath);
    const base64 = imageBuffer.toString("base64");

    const data = {
      contents: [
        {
          parts: [
            { text: "What is in this image?" },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    const description =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "No description.";

    res.json({ description });

    // Optional: Delete image after use
    await fs.unlink(imagePath);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
