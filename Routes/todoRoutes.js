const auth=require("../middleware/auth.js")
const express=require("express")
const router=express.Router()

const{
     createTask,deleteTask,updateTask,getallTask
}=require("../controllers/todocontroller.js")

router.get("/todo",auth,getallTask)
router.post("/todo",auth,createTask)
router.delete("/todo/:id",auth,deleteTask)
router.put("/todo/:id",auth,updateTask)

module.exports=router;