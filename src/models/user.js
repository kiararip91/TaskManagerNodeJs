const mongoose = require("mongoose")
const validator = require("validator")
const bycript = require("bcryptjs")
const jwt = require("jsonwebtoken")

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

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, "thisisthekey")
    return token
}
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