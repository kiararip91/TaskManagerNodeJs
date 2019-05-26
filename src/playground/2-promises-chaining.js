require("../db/mongoose")
const Task = require("../models/task")

Task.findByIdAndDelete("5ce92cfdb2225d556e26388d").then((taks) => {
    console.log(taks)
    return Task.find({completed: false})
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const sum = await Task.countDocuments({completed : false})
    return sum
}

deleteTaskAndCount("5ce9350959bc0c57c29d311f").then((sum) => {
    console.log(sum)
}).catch((error) => {
    console.log(error)
})