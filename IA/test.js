import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

async function testAnalyze() {
  try {
    // Create a FormData instance to simulate multipart/form-data request
    const form = new FormData();

    // Append the image file from the current directory
    form.append("image", fs.createReadStream("./test.jpeg"));

    // Send POST request to your local server analyze endpoint
    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      body: form,
      headers: form.getHeaders(), // Set the appropriate headers for multipart data
    });

    // Parse JSON response
    const data = await response.json();

    // Log the response content from the server
    console.log("Response from /analyze:", data);
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error during test:", error);
  }
}

// Run the test function
testAnalyze();
