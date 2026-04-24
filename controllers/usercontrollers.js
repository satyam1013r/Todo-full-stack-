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
            _id:user._id,
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
// debug 3 line 
// console.log("BODY:", req.body);
// console.log("EMAIL:", `"${req.body.email}"`);
// console.log("PASSWORD:", `"${req.body.password}"`);

        const email = req.body.email.trim()
const password = req.body.password.trim()
        const user=await User.findOne({email})
//         if (!user || user.password !== password) {
//     return res.status(400).json({ message: "Invalid credentials" })
// }
//debug add this checks postman
if (!user) {
    return res.status(400).json({ message: "User not found" });
}

if (user.password !== password) {
    return res.status(400).json({ message: "Wrong password" });
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