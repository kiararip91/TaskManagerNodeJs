const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth")
const User = require("../models/user")

router.post("/users/login", async (req, res) => {
    try{
        const user = await User.findByUserCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token})
        await user.save()
        res.send({user, token})
    }catch(error){
        res.status(400).send()
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token != req.token
        })

        await req.user.save()
        res.send()

    }catch(error){
        res.status(500).send()
    }

})

router.post("/users/logoutall", auth, async (req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()
        res.send()

    }catch(error){
        res.status(500).send()
    }

})

router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token})
        await user.save()
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send("An error occurred " + error)

    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send("An error occurred " + error)
    // })
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})


router.patch("/users/me", auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "password", "email"]
    const validOperation = updates.every((update) => {return allowedUpdates.includes(update) })

    if(!validOperation){
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        //I can t use this line to update the user beacuse it does not fire the save user event and it does not hash the password!
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true}
        res.send(req.user)
    }catch(error){
        res.status(400).send()
    }
})


router.delete("/users/me", auth, async (req, res) => {
    try{
        console.log("delete")
        await req.user.remove()
        console.log("delete")
        res.send(req.user)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router