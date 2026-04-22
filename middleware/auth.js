const jwt=require("jsonwebtoken")
const auth=(req,res,next)=>{
    try{
        const token=req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(401).json({message:"No token"})
        }
         const decoded=jwt.verify(token,process.env.JWT_Secret)
         req.userId=decoded.userId                                 //Take userId from token and store it in request
         next()

    }
    catch(error){
        console.log(error)
        res.status(401).json({message:"Invalid Token"})
    }
}

module.exports=auth