const express = require("express")
require("./db/mongoose")

const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000

app.use((req,res,next) => {
    if(req.method === "GET"){
        res.send("Get requests are disbled")
    }
    next()
})

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log("Server is listening in port " + port)
})

const jwt = require("jsonwebtoken")

const myFunction = async() => {
    const token = jwt.sign({_id: "ajfsoj"}, "thisisatest", {expiresIn : "7 days"})
    console.log(token)

    const verify = jwt.verify(token, "thisisatest")
    console.log(verify)

}

//myFunction()