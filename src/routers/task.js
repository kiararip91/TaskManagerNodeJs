const express = require("express")
const router = new express.Router()

const Task = require("../models/task")

router.get("/tasks", async (req, res) => {
    
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(error){
        res.status(500).send(error)
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
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

router.post("/tasks", async (req, res) => {
    const task = new Task(req.body)

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

router.patch("/tasks/:id", async (req, res) => {
    const operations = Object.keys(req.body)
    const allowedOperations = ["description", "completed"]

    const validOperation = operations.every((update) => { return allowedOperations.includes(update)})

    if(!validOperation){
        return res.status(400).send({error : "Invalid Operation!"})
    }


    try{
        const task = await Task.findById(req.params.id)
        
        operations.forEach((operation) => { task[operation] = req.body[operation]})
        task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})
        if(!task){
            return res.status(404).send({error : "task not found"})
        }
    
        res.send(task)

    }catch(error){
        res.status(400).send(error)
    }

})

router.delete("/tasks/:id", async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router