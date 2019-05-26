const mongoose = require("mongoose")

//We can customize the schema only if we explicitely create it (eg. timestamps)
const taskSchema = new mongoose.Schema({
    description : {
        type: String,
        required : true,
        trim : true
    },
    completed : {
        type: Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }
},
{
    timestamps: true
})
const Task = mongoose.model("Task", taskSchema)

module.exports = Task