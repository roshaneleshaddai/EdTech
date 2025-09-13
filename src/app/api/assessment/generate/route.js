import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function GET(req) {
  const moduleId = req.nextUrl.searchParams.get("moduleId");

  if (!moduleId) {
    return Response.json({ error: "Module ID is required" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI assessment generator for an EdTech platform. Generate a practical, hands-on assessment for a specific module.

    Module ID: ${moduleId}

    Return a JSON object with this exact structure:
    {
      "id": "assessment-id",
      "moduleId": "module-id",
      "title": "Assessment Title",
      "description": "Assessment description",
      "type": "project|quiz|hands-on",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "X minutes",
      "instructions": "Detailed step-by-step instructions",
      "requirements": [
        {
          "id": "req-1",
          "description": "Requirement description",
          "points": 10,
          "type": "mandatory|optional"
        }
      ],
      "evaluationCriteria": [
        {
          "criterion": "Functionality",
          "description": "Does the solution work as expected?",
          "weight": 0.4
        },
        {
          "criterion": "Code Quality",
          "description": "Is the code clean and well-structured?",
          "weight": 0.3
        },
        {
          "criterion": "Creativity",
          "description": "Does the solution show creative thinking?",
          "weight": 0.2
        },
        {
          "criterion": "Documentation",
          "description": "Is the solution well-documented?",
          "weight": 0.1
        }
      ],
      "sampleSolution": "A sample solution or key points",
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "type": "documentation|tutorial|reference"
        }
      ],
      "hints": [
        "Hint 1: Start with...",
        "Hint 2: Consider using..."
      ]
    }

    Make the assessment practical and project-based, focusing on real-world application of the module concepts.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let assessment;
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing assessment response:", parseError);
      return Response.json(
        { error: "Failed to parse assessment data" },
        { status: 500 }
      );
    }

    // Add timestamps and unique ID
    assessment.id = `assessment_${Date.now()}`;
    assessment.createdAt = new Date().toISOString();

    return Response.json(assessment);
  } catch (error) {
    console.error("Error generating assessment:", error);
    return Response.json(
      { error: "Failed to generate assessment" },
      { status: 500 }
    );
  }
}
