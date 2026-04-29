// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// app.use(cors());
// app.use(express.json());

// //Gemini Setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const personas = {
//   mentor: "You are a career mentor. Give step-by-step guidance.",
//   developer: "You are a senior developer. Explain technically.",
//   hr: "You are an HR interviewer. Give professional advice.",
//   critic: "You are brutally honest. Point out mistakes.",
// };

// app.post("/chat", async (req, res) => {
//   const { message, persona, panelMode } = req.body;
//   const activePersona = (persona || "mentor").toLowerCase();

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

//     if (panelMode) {
//       const responses = {};

//       for (const key of Object.keys(personas)) {
//         try {
//           const prompt = `${personas[key]}\n\nUser Question: ${message}`;
//           const result = await model.generateContent(prompt);

//           // correct usage
//           responses[key] = result.response.text();
//         } catch (err) {
//           console.error(`Error in ${key}:`, err);
//           responses[key] = "⚠️ API error";
//         }
//       }

//       return res.json({ responses });
//     }

//     // Single persona
//     const prompt = `${personas[activePersona]}\n\nUser Question: ${message}`;
//     const result = await model.generateContent(prompt);

//     return res.json({
//       reply: result.response.text(),
//     });

//   } catch (error) {
//     console.error("FULL ERROR:", error);
//     return res.status(500).json({
//       error: error.message || "Gemini failed",
//     });
//   }
// });
// console.log("API KEY:", process.env.GEMINI_API_KEY);
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🎭 Smart AI Logic
function smartReply(msg, persona) {
  msg = msg.toLowerCase();

  if (msg.includes("dsa") || msg.includes("coding")) {
    return "Start with arrays, strings, and recursion. Practice daily on LeetCode and focus on patterns like sliding window and binary search.";
  }

  if (msg.includes("placement")) {
    return "Build 2 strong projects, practice DSA daily, and prepare HR questions.";
  }

  if (msg.includes("ai") || msg.includes("machine learning")) {
    return "Start with Python, learn ML basics, then build projects like chatbot or recommendation system.";
  }

  // Persona variation
  if (persona === "mentor") {
    return "Stay consistent. Focus on small steps daily and improve gradually.";
  }

  if (persona === "developer") {
    return "Focus on problem-solving and writing optimized code.";
  }

  if (persona === "hr") {
    return "Improve communication and confidence.";
  }

  if (persona === "critic") {
    return "You lack consistency. Fix your discipline first.";
  }

  return "Keep practicing and stay focused.";
}

// API
app.post("/chat", (req, res) => {
  const { message, persona } = req.body;

  const reply = smartReply(message, persona);

  res.json({ reply });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});