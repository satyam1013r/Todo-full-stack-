const mongoose=require("mongoose")
const TodoSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,// see as id 
        ref:"User",                         
                                                     // tells which model it connects to? model name write  it tell mongoose This userId comes from the User model”
        required:true
    }
},{timestamps:true})// add createAt and updateAt?

module.exports=mongoose.model("Todo",TodoSchema)