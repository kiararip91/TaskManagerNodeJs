const mongoose = require("mongoose")
const validator = require("validator")
const bycript = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("../models/task")

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required : true,
        trim : true
    },
    email : {
        type: String,
        unique: true,
        required: true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email not valid")
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim : true,
        minlength : 7,
        validate(value) {
            if(value.includes("password")){
                throw new Error("Password not valid")
            }
        }
    },
    age : {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField : "_id",
    foreignField : "owner"

})

userSchema.statics.findByUserCredentials = async (email, password) => {

    const user = await User.findOne({email})
    if(!user){
        
        throw new Error("Unable to login")
    }

    const isMatch = await bycript.compare(password, user.password)

    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password
    console.log("to json" + JSON.stringify(userObject))

    return userObject
}
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, "thisisthekey")
    return token
}

//Remore user tasks when removing a user
userSchema.pre("remove", async function(next){
    const user = this
    await Task.deleteMany({owner: user.id})

    next()
})
//Hash the plain text password before saving
userSchema.pre("save", async function(next) {
    const user = this
    if(user.isModified("password")){
        user.password = await bycript.hash(user.password, 8)

    }
    //Call next when you are done
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User