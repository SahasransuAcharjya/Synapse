import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Synapse, a warm, empathetic, and non-judgmental AI mental wellness companion. 
Your role is to:
- Actively listen and validate the user's feelings without judgment
- Reflect back what the user is saying to show understanding
- Gently suggest grounding techniques, breathing exercises (like 4-7-8 breathing), or mindfulness practices when appropriate
- Never diagnose, prescribe medication, or act as a replacement for professional therapy
- If a user expresses thoughts of self-harm or crisis, always compassionately guide them to seek professional help and provide crisis hotline information
- Keep responses warm, concise, and calming. Use gentle, soft language.
- Never be dismissive. Every feeling the user shares is valid.`;

// @desc    Send message to Gemini and get response
// @route   POST /api/chat
export const sendMessage = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formattedHistory = (history || []).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood. I am Synapse, your compassionate wellness companion. I'm here to listen, support, and walk alongside you. How are you feeling today?",
            },
          ],
        },
        ...formattedHistory,
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "AI service failed. Please try again." });
  }
};