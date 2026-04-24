require("dotenv").config()
const express=require("express")
const cors=require("cors")
const todoRoutes=require("./Routes/todoRoutes.js")
const UserRoutes=require("./Routes/userRoutes.js")
const DataBase=require("./config/config.js")
const path=require("path")



const app=express()
//connect middleware
app.use(express.json())
app.use(cors({
  origin: "*", // allow all (for now)
}));

app.use(express.static(path.join(__dirname,"public")))

//database connect
DataBase()

// routes set
app.get("/",(req,res)=>{
    res.send("Welcome to my TODO")
})

app.use("/api",todoRoutes)
app.use("/api",UserRoutes)



//port 
const port=process.env.PORT||3000


// listen 
app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})