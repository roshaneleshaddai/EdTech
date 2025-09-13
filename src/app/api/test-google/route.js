import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function GET(req) {
  try {
    // Test if API key is set
    if (!process.env.GOOGLE_AI_API_KEY) {
      return Response.json(
        {
          error: "GOOGLE_AI_API_KEY not set",
          status: "missing_api_key",
        },
        { status: 400 }
      );
    }

    // Try to list available models
    try {
      const models = await genAI.listModels();
      const modelNames = models.map((model) => model.name);

      // Filter for Gemini models that support generateContent
      const geminiModels = modelNames.filter(
        (name) =>
          name.includes("gemini") &&
          !name.includes("embedding") &&
          !name.includes("embed")
      );

      return Response.json({
        status: "success",
        apiKeySet: true,
        allModels: modelNames,
        geminiModels: geminiModels,
        recommendedModel: geminiModels[0] || "No Gemini models found",
        message: "Google AI connection successful",
      });
    } catch (listError) {
      return Response.json(
        {
          status: "error",
          apiKeySet: true,
          error: listError.message,
          message: "API key is set but cannot list models",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error.message,
        message: "Failed to connect to Google AI",
      },
      { status: 500 }
    );
  }
}
