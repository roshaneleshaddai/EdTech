import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(req) {
  try {
    const { assessmentId, submission } = await req.json();

    if (!assessmentId || !submission) {
      return Response.json(
        { error: "Assessment ID and submission are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI assessment evaluator for an EdTech platform. Evaluate a student's submission against the assessment criteria and provide detailed feedback.

    Assessment ID: ${assessmentId}
    Submission: ${JSON.stringify(submission, null, 2)}

    Return a JSON object with this exact structure:
    {
      "overallScore": 85,
      "maxScore": 100,
      "grade": "B+",
      "feedback": {
        "summary": "Overall feedback summary",
        "strengths": ["strength1", "strength2"],
        "areasForImprovement": ["improvement1", "improvement2"],
        "nextSteps": ["step1", "step2"]
      },
      "detailedEvaluation": [
        {
          "criterion": "Functionality",
          "score": 8,
          "maxScore": 10,
          "feedback": "The solution works well but could be more robust",
          "suggestions": ["Add error handling", "Test edge cases"]
        }
      ],
      "recommendations": [
        {
          "type": "resource",
          "title": "Recommended Resource",
          "url": "https://example.com",
          "reason": "This will help improve your understanding of..."
        }
      ],
      "encouragement": "Great work! You're making excellent progress in this area.",
      "completedAt": "2024-01-01T00:00:00.000Z"
    }

    Be constructive, encouraging, and specific in your feedback. Focus on helping the student improve while acknowledging their efforts.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let evaluation;
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing evaluation response:", parseError);
      return Response.json(
        { error: "Failed to parse evaluation data" },
        { status: 500 }
      );
    }

    // Add metadata
    evaluation.assessmentId = assessmentId;
    evaluation.evaluatedAt = new Date().toISOString();

    return Response.json(evaluation);
  } catch (error) {
    console.error("Error evaluating assessment:", error);
    return Response.json(
      { error: "Failed to evaluate assessment" },
      { status: 500 }
    );
  }
}
