import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

async function testAnalyze() {
  try {
    const form = new FormData();

    form.append("image", fs.createReadStream("./test.jpeg"));

    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();
    console.log("Response from /analyze:", data);
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testAnalyze();
