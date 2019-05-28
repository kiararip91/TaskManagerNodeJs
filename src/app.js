const express = require("express")
require("./db/mongoose")

const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")

const app = express()

// app.use((req,res,next) => {
//     if(req.method === "GET"){
//         res.send("Get requests are disbled")
//     }
//     next()
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

module.exports = app
