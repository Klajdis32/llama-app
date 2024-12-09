import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // Αρχικοποίηση Groq

export const request = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text in request body" });
    }

    // Δημιουργία ερώτησης μέσω του Groq SDK
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: text }, // Το μήνυμα του χρήστη
      ],
      model: "llama-3.3-70b-versatile", // Το επιθυμητό μοντέλο
    });

    // Εξαγωγή της απάντησης
    const responseText = chatCompletion.choices[0]?.message?.content || "No response generated";

    // Επιστροφή της απάντησης
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error generating response from Groq:", error);
    res.status(500).json({ error: "Failed to generate response from Groq" });
  }
};
