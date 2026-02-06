import { generateInterviewQuestions } from '../utils/openai.js';
import Interview from '../models/interview.model.js'



export const interview = async (req, res) => {
  try {
    const {category, difficulty} = req.body;
    const userId = req.user.userId;
    // console.log("Received interview request with category:", category, "and difficulty:", difficulty);
    if(!category || !difficulty){
      return res.status(400).json({message: "All fields are required", success: false});
    }
    

    const questions = await generateInterviewQuestions({category, difficulty})
    console.log("questions", questions);

    if(!questions){
      return res.status(400).json({message:"Cant't start interview due to errors in server", success: false})
    }

     const interview = await Interview.create({
      userId,
      category,
      difficulty,
      questions,
    });

    console.log("Interview created with ID:", interview._id, interview.questions);

    return res.status(200).json({message:"Interview started successfully", success: true})



  } catch(error) {
    console.log(error)
    console.log("backend is not working")
    return res.status(500).json({message:'backend is not working', success: false})
  }
}

