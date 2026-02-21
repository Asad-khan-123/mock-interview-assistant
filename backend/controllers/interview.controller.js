import { generateInterviewQuestions } from '../utils/openai.js';
import InterviewSession from '../models/interview.model.js';
import { analyzeInterview } from '../utils/interviewanalyze.js';



export const interview = async (req, res) => {
  try {
    const {category, difficulty} = req.body;
    const candidateId = req.user.userId;
    // console.log("Received interview request with category:", category, "and difficulty:", difficulty);
    if(!category || !difficulty){
      return res.status(400).json({message: "All fields are required", success: false});
    }
    

    // const questions = await generateInterviewQuestions({category, difficulty})
const questions  = [
  {
    question: 'Given a binary tree, write a function to check if it is a binary search tree (BST).'
  },
  {
    question: 'Implement a function to find the longest substring without repeating characters in a given string.'
  },
  {
    question: 'Design a data structure that supports insert, delete, and getRandom operations in constant time.'
  },
  {
    question: 'Given an array of integers, find the length of the longest increasing subsequence.'
  },
  {
    question: 'Write a function to merge k sorted linked lists into one sorted linked list.'      
  }
]

    if(!questions){
      return res.status(400).json({message:"Cant't start interview due to errors in server", success: false})
    }

     const interview = await InterviewSession.create({
      candidateId,
      category,
      difficulty,
      questions: questions.map((q) => ({
        text: q.question,
      })),
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      status: "running"
    });


    return res.status(200).json({
      interview: interview._id,
      message:"Interview started successfully",
      success: true})



  } catch(error) {
    console.log(error)
    console.log("backend is not working")
    return res.status(500).json({message:'backend is not working', success: false})
  }
}


export const getInterviewDetails = async(req, res) => {
  const {id} = req.params;
  try{
    const interview = await InterviewSession.findById(id);

    if(!interview){
      return res.status(404).json({message: "Interview not found", success: false});
    }
    return res.status(200).json({interview, message: "Interview details fetched successfully", success: true});

  } catch(error) {
    return res.status(500).json({message: "Server Error", success: false});
  }
}

export const InterviewUpdate = async (req, res) => {
  const { id } = req.params;
  const { currentQuestionIndex, answer, isFinal } = req.body;
  console.log('current question index:', currentQuestionIndex, 'answer:', answer, 'isFinal:', isFinal);

  try {
    const interview = await InterviewSession.findById(id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
        success: false,
      });
    }

    // ✅ Save current index
    interview.currentQuestionIndex = currentQuestionIndex;

    // ✅ Save current answer
    const question =
      interview.questions[currentQuestionIndex - 1];

    if (question) {
      interview.answers.push({
        question: question.text,
        answerText: answer || "",
        answerType: "voice",
        timeTaken: 0,
      });
    }

    // 🟢 If not final → normal update
    if (!isFinal) {
      await interview.save();

      return res.status(200).json({
        message: "Interview updated",
        success: true,
      });
    }

    // 🔥 IF FINAL SUBMIT
    interview.status = "completed";
    await interview.save();

    // 👇 AI Analysis Call
    const analysis = await analyzeInterview(interview);

    return res.status(200).json({
      message: "Interview completed",
      success: true,
      result: analysis,
    });

  } catch (error) {
    console.error("Final Submit Error:", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};