const User=require("../models/usermodels")
const jwt=require("jsonwebtoken")


//signup
const signup=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email||!password){
            return res.status(400).json({message:"All field are Requried!"})
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const user=new User({email,password})
        await user.save()
        res.status(201).json({
            _id:user.id,
            email:user.email
        })
    }
    catch(error){
        console.log(`Error: ${error}`)
        res.status(500).json({message:error.message})
    }
}



//login 
const login=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email,password})
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }        
        const token=jwt.sign(
            {userId:user._id},
           process.env.JWT_Secret,
            {expiresIn:"1d"}
        )
        res.json(token)
    }
    catch(error){
        console.log(`Error: ${error}`)
        res.status(500).json({message:error.message})
    }
}

module.exports={signup,login}