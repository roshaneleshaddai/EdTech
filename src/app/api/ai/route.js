import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function GET(req) {
  const question = req.nextUrl.searchParams.get("question");
  const context = req.nextUrl.searchParams.get("context") || "";

  if (!question) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  try {
    // Try different model names in order of preference
    const modelNames = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
    ];
    let model;
    let lastError;

    for (const modelName of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        break; // If successful, break out of the loop
      } catch (error) {
        lastError = error;
        continue; // Try next model
      }
    }

    if (!model) {
      throw lastError || new Error("No available models found");
    }

    let contextData = {};
    if (context) {
      try {
        contextData = JSON.parse(context);
      } catch (e) {
        console.error("Error parsing context:", e);
      }
    }

    const prompt = `You are an AI professor in a 3D EdTech platform. A student is asking a question during their course. Provide contextual, helpful answers based on the course context.

    Course Context: ${contextData.course || "General Learning"}
    Module: ${contextData.module || "General Topic"}
    Key Concepts: ${
      contextData.concepts
        ? contextData.concepts.join(", ")
        : "General concepts"
    }

    Student Question: ${question}

    Respond with a JSON object in this exact format:
    {
      "answer": "Your detailed answer to the student's question",
      "relatedConcepts": ["concept1", "concept2"],
      "examples": ["example1", "example2"],
      "nextSteps": ["suggestion1", "suggestion2"],
      "encouragement": "Encouraging message to keep the student motivated"
    }

    Be encouraging, clear, and provide practical examples. If the question is outside the course context, gently redirect to relevant topics.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let jsonResponse;
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Fallback response if JSON parsing fails
      jsonResponse = {
        answer: text,
        relatedConcepts: [],
        examples: [],
        nextSteps: [],
        encouragement:
          "Keep up the great work! Continue exploring and learning.",
      };
    }

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Error with Google AI:", error);
    return Response.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
