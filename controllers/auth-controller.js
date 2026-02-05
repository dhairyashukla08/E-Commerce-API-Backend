import User from "../models/user-model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config()

export const signUp=async(req,res)=>{
    const {username,email,password,role}=req.body;
    const emailExist=await User.findOne({email:email});
    if(emailExist){
        return res.status(400).json({message:"email is already in use,please login"});
    }
    try {
        const user=await User.create({
            email,password,username,role,
        });
        const token=jwt.sign({email:user.email,id:user._id,role: user.role,name: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
         res.cookie("token",token,{expiresIn:"1d"})
        res.status(201).json({user,token})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const  login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({ message: "Please enter email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
   if(!isPasswordCorrect)
   {
    return res.status(400).json({message:"Invalid credentials"});
   }
   const token=jwt.sign({email:user.email,id:user._id,role: user.role,name: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
   res.cookie("token",token,{expiresIn:"1d"})
   res.status(200).json({   user,token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
   
}

export const logOut=async (req,res)=>{
    try {
         res.cookie("token","",{expiresIn:new Date(0)});
    res.status(200).json({ message: "User Logged Out Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
   
}

