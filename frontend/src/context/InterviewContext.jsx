import {createContext, useState} from "react";

export const InterviewContext = createContext(null);

export const InterviewProvider = ({children}) => {
  const [interviewData, setInterviewData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(); // Store answers here
  const [listening, setListening] = useState(false); // Speech recognition status

  return (
    <InterviewContext.Provider
      value={{
        interviewData,
        setInterviewData,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        setAnswers
      }}
      >
        {children}
      </InterviewContext.Provider>
  )
}
