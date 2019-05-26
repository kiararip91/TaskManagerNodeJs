const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth")

const Task = require("../models/task")

router.get("/tasks", auth, async (req, res) => {
    try{
        const match = {}
        
        if(req.query.completed){
            match.completed = req.query.completed === "true"
        }
        //const tasks = await Task.find({owner: req.user.id})
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(error){
        res.status(500).send(error)
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner : req.user.id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
    
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.post("/tasks", auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send("An error occurred " + error)
    }
    
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send("An error occurred " + error)
    // })
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const operations = Object.keys(req.body)
    const allowedOperations = ["description", "completed"]

    const validOperation = operations.every((update) => { return allowedOperations.includes(update)})

    if(!validOperation){
        return res.status(400).send({error : "Invalid Operation!"})
    }


    try{
        const task = await Task.findOne({_id: req.params.id, owner : req.user.id})
        
        operations.forEach((operation) => { task[operation] = req.body[operation]})
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})
        if(!task){
            return res.status(404).send({error : "task not found"})
        }
    
        res.send(task)

    }catch(error){
        res.status(400).send(error)
    }

})

router.delete("/tasks/:id", auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user.id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router