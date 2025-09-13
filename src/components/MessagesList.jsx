import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const { currentMessage } = useAITeacher();
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();

  useEffect(() => {
    container.current.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);


  const renderDoubtAnswer = (answer) => (
    <div className="space-y-4">
      <p className="text-4xl text-white font-bold">{answer.answer}</p>
      
      {answer.relatedConcepts && answer.relatedConcepts.length > 0 && (
        <div>
          <h4 className="text-2xl font-semibold text-blue-300 mb-2">Related Concepts:</h4>
          <div className="flex flex-wrap gap-2">
            {answer.relatedConcepts.map((concept, index) => (
              <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-lg">
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {answer.examples && answer.examples.length > 0 && (
        <div>
          <h4 className="text-2xl font-semibold text-green-300 mb-2">Examples:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {answer.examples.map((example, index) => (
              <li key={index} className="text-2xl">{example}</li>
            ))}
          </ul>
        </div>
      )}
      
      {answer.nextSteps && answer.nextSteps.length > 0 && (
        <div>
          <h4 className="text-2xl font-semibold text-yellow-300 mb-2">Next Steps:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {answer.nextSteps.map((step, index) => (
              <li key={index} className="text-2xl">{step}</li>
            ))}
          </ul>
        </div>
      )}
      
      {answer.encouragement && (
        <div className="bg-green-900/30 rounded-lg p-4">
          <p className="text-2xl text-green-300 font-medium">{answer.encouragement}</p>
        </div>
      )}
    </div>
  );


  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80`}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            AI Learning Platform
            <br />
            Interactive Education
          </h2>
          <h2 className="text-6xl font-bold text-blue-400/90 italic">
            Learn with 3D AI Professor
          </h2>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i}>
          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <span className="text-white/90 text-2xl font-bold uppercase px-3 py-1 rounded-full bg-purple-600">
                  AI Professor
                </span>
                {renderDoubtAnswer(message.answer)}
              </div>
            </div>
            {currentMessage === message ? (
              <button
                className="text-white/65"
                onClick={() => stopMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="text-white/65"
                onClick={() => playMessage(message)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
