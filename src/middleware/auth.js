const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token,"thisisthekey")
        const user = await User.findOne({_id:decoded._id, "tokens.token" : token})
        console.log("user" + user)
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }catch(error){
        res.status(401).send({error: "please authenticate"})
    }
}

module.exports = auth