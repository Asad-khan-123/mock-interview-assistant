import {User} from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

export const signup = async(req, res) => {
  try{
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
      return res.status(400).json({message: "All fields are required", success: false})
    }

    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "User already exist", success: false})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    })

    return res.status(200).json({message: "USer registered successfully", success: true});
    
  } catch(error) {
    return res.status(500).json({message: "Server Error", success: false});
  }
}

export const login = async(req, res) => {
  try{
    const {email, password} = req.body;
    if(!email||!password) {
      return res.status(400).json({mesaage:"All eilds are required", success:false})
    }
    const user = await User.findOne({email});
  
    if(!user){
      return res.status(400).json({message:"First create an account ", success:false})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message:"Incorrect Password", success:false})
    }

    
    const token = await jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "1d"});
    console.log("token", token);
    return res.json({
      token,
      message: `welcome back ${user.username}`,
      user,
      success: true
    })


  } catch(error) {
    return res.status(500).json({message: "Server Error", success: false});
  }
}


export const logout = async(req, res) => {
  try {
    return res.status(200).json({message: "Logged out successfully", success: true});
  } catch(error) {
    return res.status(500).json({message: "Server Error", success: false});
  }
}



