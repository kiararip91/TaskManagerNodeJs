const express = require("express")
require("./db/mongoose")

const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000

// app.use((req,res,next) => {
//     if(req.method === "GET"){
//         res.send("Get requests are disbled")
//     }
//     next()
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log("Server is listening in port " + port)
})

const Task = require("./models/task")
const User = require("./models/user")

const main = async() =>{
    // const task = await Task.findById("5ceaeebe13a3d45ae016f55b")
    // await task.populate("owner").execPopulate()
    // console.log(task.owner)

    const user = await User.findById("5ceaeb8def80a758835199e4")
    await user.populate("tasks").execPopulate()
    console.log(user.tasks)
}

//main()