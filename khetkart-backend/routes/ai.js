// routes/ai.js
// POST /api/ai/chat — farming assistant powered by Google Gemini (free)

const express = require("express");
const router  = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ message: "No messages provided." });
    }

    const SYSTEM_PROMPT = `You are KhetBot, a friendly farming assistant for KhetKart — India's direct farm-to-vendor marketplace.

Your role:
- Help FARMERS with crop advice, pest control, soil health, irrigation, harvest timing, pricing their crops
- Help VENDORS with which crops to buy, seasonal availability, quality checks, storage tips
- Answer questions about Indian agriculture, crop seasons, mandi prices, government schemes (PM-KISAN etc.)
- Keep answers SHORT, practical, and easy to understand
- Use simple English mixed with common Hindi farming terms (like kharif, rabi, mandi, quintal) where natural
- Always be encouraging and supportive
- If asked non-farming questions, politely redirect to farming topics
- Format responses cleanly — use bullet points for lists, keep paragraphs short`;

    // Convert messages to Gemini format
    // Gemini uses "user" and "model" roles (not "assistant")
    const geminiMessages = messages.map(({ role, content }) => ({
      role: role === "assistant" ? "model" : "user",
      parts: [{ text: content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({ message: "AI service error. Please try again." });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;