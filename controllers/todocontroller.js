const TODO=require("../models/todomodels")


// task.userId → who owns the task               this come from middleware (req.userId = decoded.userId;)
// req.userId → who is making request           come from database when we create Task 

//create Task
const createTask=async(req,res)=>{
    try{
        const task=req.body.task
        console.log(req.userId)
        if(!task||!req.userId){
            return res.status(400).json({message:"All fields are required!"})
        }
        const todo=new TODO({
            task,
            userId:req.userId                     // tell mongodb this task belong to this user (from middleware)
        })
        await todo.save()
        res.json(todo)
    }
    catch(error){
        console.log(`Error: ${error}`);
        res.status(500).json({message:error.message})
        
    }
}

// get all Task
const getallTask=async (req,res)=>{
    try{                                 //Give me only tasks of logged-in user (userId:req.userId) without it give all user task security issue
        const tasks=await TODO.find({userId:req.userId})          // req.userId come from middleware (LoggedIn user?)
                                                                // req.userId = decoded.userId;
        res.json(tasks)

    }
    catch(error){
        console.log(`Error: ${error}`)
        res.status(500).json({message:error.message})
    }
}


// Delete task
const deleteTask=async (req,res)=>{
    try{
        const task=await TODO.findById(req.params.id)
        if(!task || task.userId.toString()!==req.userId){
            return res.status(403).json({message:"Not Allowed!"})
        }
        await TODO.findByIdAndDelete(req.params.id)
        res.json({message:"Task Deleted!"})

    }
    catch(error){
        console.log(`Error: ${error}`)
        res.status(500).json({message: error.message})
    }
}

//update Task
const updateTask=async (req,res)=>{
    try{
        const task=await TODO.findById(req.params.id)
        if(!task || task.userId.toString()!==req.userId){
            return res.status(403).json({message:"Not allowed!"})
        }
        const updated=await TODO.findByIdAndUpdate(
            req.params.id,
            req.body,
            {returnDocument:"after"}
        )
        res.json(updated)


    }
    catch(error){
        console.log(`Error: ${error}`)
        res.status(500).json({message:error.message})
    }
}

module.exports={
    createTask,deleteTask,updateTask,getallTask
}