// routes/ai.js
// POST /api/ai/chat — farming assistant powered by Groq (free)

const express = require("express");
const router  = express.Router();

const FARMER_PROMPT = `You are KhetBot, a friendly farming assistant for KhetKart — India's direct farm-to-vendor marketplace.

You are talking to a FARMER (kisan). Focus on:
- Crop selection for kharif/rabi seasons
- Pest control and disease management
- Soil health, fertilizer, and irrigation tips
- Harvest timing and post-harvest storage
- How to price crops and get best mandi rates
- Government schemes like PM-KISAN, MSP, crop insurance
- How to list and sell crops directly to vendors on KhetKart

Language:
- Simple English with natural Hindi farming words: kharif, rabi, mandi, quintal, bigha, MSP, kisan, sowing
- Do NOT use bracketed translations like "Paddy (Bhat)" — just use the common name
- Be encouraging and practical

Formatting rules (strictly follow):
- Keep total response under 120 words
- Use plain "-" bullet points, no "*" bullets
- No markdown bold (**text**), no headers, no italics
- Max 5 bullet points per response
- End with one short encouraging line`;

const VENDOR_PROMPT = `You are KhetBot, a friendly assistant for KhetKart — India's direct farm-to-vendor marketplace.

You are talking to a VENDOR (buyer). Focus on:
- Which crops to buy in which season (kharif/rabi)
- How to check crop quality before buying
- Seasonal availability — when to expect which crops
- Storage tips for bulk purchases (grains, vegetables, fruits, pulses)
- Price trends and negotiation tips at mandi rates
- Benefits of buying direct from farmers on KhetKart (no middlemen, fresher produce)
- Food safety and handling of fresh produce

Language:
- Simple business-friendly English
- Natural use of trade terms: mandi, quintal, wholesale, procurement, MSP
- Do NOT use bracketed translations

Formatting rules (strictly follow):
- Keep total response under 120 words
- Use plain "-" bullet points, no "*" bullets
- No markdown bold (**text**), no headers, no italics
- Max 5 bullet points per response
- End with one short encouraging line`;

const DEFAULT_PROMPT = `You are KhetBot, a friendly farming assistant for KhetKart — India's direct farm-to-vendor marketplace.
Help users with questions about Indian agriculture, crop seasons, buying/selling crops, mandi prices, and farming tips.
Keep answers short, practical, under 120 words, use "-" bullet points only, no bold or markdown.`;

router.post("/chat", async (req, res) => {
  try {
    const { messages, role } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ message: "No messages provided." });
    }

    // Pick system prompt based on user role
    const systemPrompt =
      role === "farmer" ? FARMER_PROMPT :
      role === "vendor" ? VENDOR_PROMPT :
      DEFAULT_PROMPT;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 512,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(({ role, content }) => ({ role, content })),
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return res.status(500).json({ message: "AI service error. Please try again." });
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });

  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;