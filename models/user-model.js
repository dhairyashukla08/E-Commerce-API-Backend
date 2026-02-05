import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,

    validate: {
      validator: validator.isEmail,
      message: "please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
},{timestamps:true});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }

    const salt=await bcrypt.genSalt(10)
    const pass=await bcrypt.hash(this.password,salt);

    this.password=pass;
    next();
})

userSchema.methods.compare=async function(password){
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error) {
        console.log(error)
    }
}


export default mongoose.model("User", userSchema);