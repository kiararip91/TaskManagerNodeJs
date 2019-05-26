require("../db/mongoose")
const User = require("../models/user")

// User.findByIdAndUpdate("5ce932acda908c56d355177f", {age: 1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 1})
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate("5ce932acda908c56d355177f", {age})
    const count = User.countDocuments({age})
    return count
}

updateAgeAndCount("5ce932acda908c56d355177f", 5).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})