const { create } = require("zustand");

export const teachers = ["Jenny", "Aria", "Guy", "Davis"];

export const useAITeacher = create((set, get) => ({
  // Core state
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null; // New teacher, new Voice
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,

  // Course and learning state
  currentCourse: null,
  courses: [],
  currentModule: null,
  modules: [],
  progress: {},
  assessments: [],
  currentAssessment: null,
  mode: "course", // "course", "module", "assessment"
  setMode: (mode) => {
    set(() => ({ mode }));
  },
  setCurrentCourse: (course) => {
    set(() => ({ currentCourse: course }));
  },
  setCurrentModule: (module) => {
    set(() => ({ currentModule: module }));
  },
  updateProgress: (moduleId, completed) => {
    set((state) => ({
      progress: {
        ...state.progress,
        [moduleId]: { completed, completedAt: new Date().toISOString() },
      },
    }));
  },
  addAssessment: (assessment) => {
    set((state) => ({
      assessments: [...state.assessments, assessment],
    }));
  },
  setCurrentAssessment: (assessment) => {
    set(() => ({ currentAssessment: assessment }));
  },

  // Course generation and management
  generateCourse: async (topic) => {
    if (!topic) return;

    set(() => ({ loading: true }));

    try {
      const res = await fetch(
        `/api/course/generate?topic=${encodeURIComponent(topic)}`
      );
      const course = await res.json();

      set((state) => ({
        courses: [...state.courses, course],
        currentCourse: course,
        loading: false,
      }));

      return course;
    } catch (error) {
      console.error("Error generating course:", error);
      set(() => ({ loading: false }));
      throw error;
    }
  },

  startModule: (moduleId) => {
    const course = get().currentCourse;
    if (!course) return;

    const module = course.modules.find((m) => m.id === moduleId);
    if (module) {
      set(() => ({ currentModule: module, mode: "module" }));
    }
  },

  completeModule: (moduleId) => {
    get().updateProgress(moduleId, true);
    set(() => ({ currentModule: null, mode: "course" }));
  },

  // Assessment management
  generateAssessment: async (moduleId) => {
    set(() => ({ loading: true }));

    try {
      const res = await fetch(`/api/assessment/generate?moduleId=${moduleId}`);
      const assessment = await res.json();

      get().addAssessment(assessment);
      set(() => ({ loading: false }));

      return assessment;
    } catch (error) {
      console.error("Error generating assessment:", error);
      set(() => ({ loading: false }));
      throw error;
    }
  },

  submitAssessment: async (assessmentId, submission) => {
    set(() => ({ loading: true }));

    try {
      const res = await fetch(`/api/assessment/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, submission }),
      });
      const result = await res.json();

      set(() => ({ loading: false }));
      return result;
    } catch (error) {
      console.error("Error submitting assessment:", error);
      set(() => ({ loading: false }));
      throw error;
    }
  },

  // AI doubt resolution
  askAI: async (question) => {
    if (!question) return;

    const message = {
      question,
      id: get().messages.length,
    };
    set(() => ({
      loading: true,
    }));

    const currentCourse = get().currentCourse;
    const currentModule = get().currentModule;

    try {
      const context = JSON.stringify({
        course: currentCourse?.title,
        module: currentModule?.title,
        concepts: currentModule?.content?.keyConcepts,
      });

      const res = await fetch(
        `/api/ai?question=${encodeURIComponent(
          question
        )}&context=${encodeURIComponent(context)}`
      );
      const data = await res.json();

      message.answer = data;

      set(() => ({
        currentMessage: message,
      }));

      set((state) => ({
        messages: [...state.messages, message],
        loading: false,
      }));

      get().playMessage(message);
    } catch (error) {
      console.error("Error asking AI:", error);
      set(() => ({ loading: false }));
    }
  },

  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));

      try {
        // Get TTS for the answer text
        const audioRes = await fetch(
          `/api/tts?teacher=${get().teacher}&text=${encodeURIComponent(
            message.answer.answer
          )}`
        );
        const audio = await audioRes.blob();
        const visemes = JSON.parse(await audioRes.headers.get("visemes"));
        const audioUrl = URL.createObjectURL(audio);
        const audioPlayer = new Audio(audioUrl);

        message.visemes = visemes;
        message.audioPlayer = audioPlayer;
        message.audioPlayer.onended = () => {
          set(() => ({
            currentMessage: null,
          }));
        };

        set(() => ({
          loading: false,
          messages: get().messages.map((m) => {
            if (m.id === message.id) {
              return message;
            }
            return m;
          }),
        }));
      } catch (error) {
        console.error("Error generating TTS:", error);
        set(() => ({ loading: false }));
      }
    }

    if (message.audioPlayer) {
      message.audioPlayer.currentTime = 0;
      message.audioPlayer.play();
    }
  },

  stopMessage: (message) => {
    if (message.audioPlayer) {
      message.audioPlayer.pause();
    }
    set(() => ({
      currentMessage: null,
    }));
  },
}));
