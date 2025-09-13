import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function GET(req) {
  const topic = req.nextUrl.searchParams.get("topic");

  if (!topic) {
    return Response.json({ error: "Topic is required" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an AI course generator for an EdTech platform. Generate a comprehensive, structured course on the given topic with practical, hands-on modules.

    Topic: ${topic}

    Return a JSON object with this exact structure:
    {
      "id": "unique-course-id",
      "title": "Course Title",
      "description": "Brief course description",
      "estimatedDuration": "X hours",
      "difficulty": "beginner|intermediate|advanced",
      "modules": [
        {
          "id": "module-id",
          "title": "Module Title",
          "description": "Module description",
          "duration": "X minutes",
          "type": "lesson|practice|project",
          "content": {
            "videoScript": "Detailed script for the 3D AI professor to deliver",
            "keyConcepts": ["concept1", "concept2"],
            "practicalExamples": ["example1", "example2"],
            "handsOnActivity": "Description of hands-on activity"
          },
          "prerequisites": [],
          "learningObjectives": ["objective1", "objective2"]
        }
      ],
      "finalProject": {
        "title": "Final Project Title",
        "description": "Comprehensive project description",
        "requirements": ["req1", "req2"],
        "evaluationCriteria": ["criteria1", "criteria2"]
      }
    }

    Focus on practical, project-based learning with real-world applications.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let course;
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        course = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing course response:", parseError);
      return Response.json(
        { error: "Failed to parse course data" },
        { status: 500 }
      );
    }

    // Add timestamps and unique ID
    course.createdAt = new Date().toISOString();
    course.id = `course_${Date.now()}`;

    // Generate unique IDs for modules
    course.modules = course.modules.map((module, index) => ({
      ...module,
      id: `module_${course.id}_${index}`,
      order: index,
    }));

    return Response.json(course);
  } catch (error) {
    console.error("Error generating course:", error);
    return Response.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
