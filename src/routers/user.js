const express = require("express")
const router = new express.Router()

const User = require("../models/user")

router.get("/users", async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(error){
        res.status(500).send()
    }
})

router.get("/users/:id", async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(error){
        res.status(500).send()
    }
    
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})

router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    }catch(error){
        res.status(400).send("An error occurred " + error)

    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send("An error occurred " + error)
    // })
})

router.patch("/users/:id", async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "password", "email"]
    const validOperation = updates.every((update) => {return allowedUpdates.includes(update) })

    if(!validOperation){
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})

        if(!user){
            return res.status(404).send()
        }
    
        res.send(user)
    }catch(error){
        res.status(400).send()
    }
})


router.delete("/users/:id", async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router