
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Language } from './types';

export const evaluateResponse = async (
  language: Language,
  missionTask: string,
  userInput: string,
  options?: string[],
  correctOptionIndex?: number
): Promise<AIResponse> => {
  // Initialize GoogleGenAI inside the function to ensure the correct API key is picked up for each request
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Determine if this is a quiz based on the presence of multiple-choice options (Language.QUIZ does not exist)
  const isQuiz = !!options && options.length > 0;
  
  const prompt = isQuiz 
    ? `Analyze the user's choice in a multiple-choice coding logic quiz.
       Question: ${missionTask}
       Options: ${options?.join(', ')}
       Correct Option: ${options?.[correctOptionIndex ?? 0]}
       User picked: ${userInput}
       
       Provide a pedagogical explanation of why their choice is correct or incorrect.
       If incorrect, guide them toward the correct logic without just giving the letter.`
    : `Analyze this user code for a coding mission.
       Language: ${language}
       Mission Task: ${missionTask}
       User Code: \`\`\`${language.toLowerCase()}\n${userInput}\n\`\`\`
       
       Rules:
       - Check if the code logically fulfills the mission.
       - Be a supportive EdTech tutor.
       - Don't give the final solution immediately if wrong.
       - If correct, praise and explain why.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING, description: "A friendly explanation." },
            hint: { type: Type.STRING, description: "A hint if the user is stuck." },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            }
          },
          required: ["isCorrect", "feedback", "hint"]
        }
      }
    });

    // Directly access the text property as per guidelines
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr) as AIResponse;
  } catch (error) {
    console.error("AI Evaluation failed", error);
    return {
      isCorrect: false,
      feedback: "Hệ thống AI đang bận, bạn vui lòng thử lại sau.",
      hint: "Hãy suy nghĩ kỹ lại một chút nhé!"
    };
  }
};
