const express = require("express");
const cors =require("cors");
const app= express()
app.use(cors());
const PORT=process.env.PORT||4000



app.listen(PORT,()=>{
    console.log("server is on!!!!")
})

app.get("/data",(req,res)=>{
    let data = {prediction_array:[0,1,2,3],
        stock_name:"abc"
    }
    res.status(201).json(data)
})

// app.get("/api",(req,res)=>{
//     res.send('helllo worrrrrpd')
// })