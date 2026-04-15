import { createContext, useState } from "react";

export const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  // Full interview object from DB
  const [interviewData, setInterviewData] = useState({});

  // Current question index (0-based)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Current question's answer text (for voice / typing in MainPanel)
  const [answers, setAnswers] = useState("");

  // Map of { questionIndex: answerText } — used for pre-populating on resume
  const [answersMap, setAnswersMap] = useState({});

  // Is speech recognition active?
  const [listening, setListening] = useState(false);

  // Posture warning counter shown in TopBar
  const [warningCount, setWarningCount] = useState(0);

  return (
    <InterviewContext.Provider
      value={{
        interviewData,
        setInterviewData,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        setAnswers,
        answersMap,
        setAnswersMap,
        listening,
        setListening,
        warningCount,
        setWarningCount,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
