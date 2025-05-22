// api/analyze.js
import formidable from "formidable";
import { promises as fs } from "fs";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const form = formidable({ maxFiles: 1, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "File parsing failed." });
    }

    try {
      const file = files.image?.[0];
      if (!file) return res.status(400).json({ error: "No file uploaded." });

      const buffer = await fs.readFile(file.filepath);
      const base64 = buffer.toString("base64");

      const payload = {
        contents: [
          {
            parts: [
              { text: "What is in this image?" },
              {
                inlineData: {
                  mimeType: file.mimetype,
                  data: base64,
                },
              },
            ],
          },
        ],
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      const description =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "No description.";

      res.status(200).json({ description });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to analyze image." });
    }
  });
}
