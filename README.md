# AI-Powered EdTech Platform

A revolutionary 3D AI-powered educational platform that transforms online learning through interactive 3D professors, AI-driven course generation, and practical project-based assessments.

## 🚀 Key Features

### AI-Driven Course Generation

- **Smart Course Creation**: Input any topic to generate comprehensive, structured courses
- **Modular Learning Paths**: Courses broken down into digestible modules with clear learning objectives
- **Adaptive Content**: AI generates content tailored to different skill levels (beginner, intermediate, advanced)

### 3D AI Professor

- **Interactive Teaching**: Virtual 3D professor delivers engaging video lessons
- **Real-time Interaction**: Ask questions and get contextual, topic-specific answers
- **Multiple Avatars**: Choose from different 3D teacher personalities
- **Lip-sync Animation**: Realistic speech animation with Microsoft Cognitive Services

### Practical Assessments

- **Project-Based Learning**: Hands-on assessments that reinforce practical skills
- **AI Evaluation**: Intelligent assessment grading with detailed feedback
- **Progress Tracking**: Monitor skill mastery and learning progress
- **Personalized Feedback**: Constructive suggestions for improvement

### Interactive Learning Experience

- **Doubt Resolution**: Real-time Q&A with contextual answers
- **Progress Visualization**: Track completion and skill development
- **Focused Learning Experience**: Streamlined course-based education platform
- **Immersive 3D Environment**: Learn in virtual classroom settings

## 🛠 Tech Stack

- **Frontend**: React, Next.js, React Three Fiber
- **3D Graphics**: Three.js, @react-three/drei
- **AI**: Google AI Studio (Gemini Pro)
- **TTS**: Microsoft Cognitive Services Speech SDK
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd r3f-ai-language-teacher-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys:

   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   SPEECH_KEY=your_microsoft_speech_key
   SPEECH_REGION=your_speech_region
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How to Use

### Course Generation

1. Switch to "AI Courses" mode
2. Click "Generate New Course"
3. Enter a topic (e.g., "Web Development", "Machine Learning", "Photography")
4. AI generates a comprehensive course with modules and assessments

### Learning Modules

1. Select a course to start learning
2. Progress through modules step-by-step:
   - **Overview**: Learning objectives and key concepts
   - **Video Lesson**: 3D AI professor delivers the lesson
   - **Concepts**: Detailed explanations and examples
   - **Practice**: Hands-on activities
   - **Assessment**: Practical project-based evaluation

### Interactive Learning

1. Ask questions during any module
2. Get contextual answers from the AI professor
3. Receive encouragement and next steps
4. Track your progress and skill development

### Assessment System

1. Complete modules to unlock assessments
2. Work on practical, project-based assignments
3. Submit your work for AI evaluation
4. Receive detailed feedback and recommendations

## 🔌 API Endpoints

- `/api/ai` - AI language translation and contextual doubt resolution
- `/api/tts` - Text-to-speech conversion with viseme data
- `/api/course/generate` - AI course generation
- `/api/assessment/generate` - AI assessment creation
- `/api/assessment/evaluate` - AI assessment evaluation

## 🎯 Learning Features

### AI-Powered Course Generation

- Generate courses on any topic
- Interactive module-based learning
- Practical assessments and projects
- Progress tracking and skill development

## 🏗 Architecture

```
src/
├── app/
│   ├── api/           # API endpoints
│   └── page.js        # Main application
├── components/
│   ├── CourseInterface.jsx      # Course management
│   ├── ModuleInterface.jsx      # Module learning
│   ├── AssessmentInterface.jsx  # Assessment system
│   ├── Teacher.jsx              # 3D AI professor
│   ├── Experience.jsx           # Main 3D scene
│   └── ...                     # Other components
├── hooks/
│   └── useAITeacher.js         # State management
└── ...
```

## 🎨 Customization

### Adding New Teachers

1. Add 3D models to `/public/models/`
2. Update the `teachers` array in `useAITeacher.js`
3. Add teacher images to `/public/images/`

### Creating Custom Courses

The AI course generator can create courses on any topic. Simply input your desired subject and the AI will generate:

- Structured learning modules
- Practical exercises
- Assessment criteria
- Learning objectives

### Assessment Types

The platform supports various assessment types:

- **Project-based**: Build something practical
- **Quiz-based**: Test knowledge retention
- **Hands-on**: Interactive activities

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Three Fiber for 3D rendering
- OpenAI for AI capabilities
- Microsoft Cognitive Services for speech synthesis
- The open-source community for inspiration and tools

---

**Transform your learning experience with AI-powered education!** 🎓✨
