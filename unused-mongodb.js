const mongodb = require("mongodb")

const {MongoClient, ObjectID} = mongodb

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

const id = new ObjectID()
console.log(id.id)
console.log(id.getTimestamp())
console.log(id.toHexString())

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("unable to connect to the DB")
    }

    const db = client.db(databaseName)
    db.collection("users").findOne({_id: new ObjectID("5ce59ce2f07054e76bbc3b1e")}, (error, user) => { 
        if(error){
            return console.log("Unable to get User")
        }

        console.log(user)

    })

    db.collection("users").find({"age":27}).toArray((error,users) => {
        console.log(users)
    }) 

//    db.collection("users").update({
//         _id: new ObjectID("5ce59ce2f07054e76bbc3b1e")
//     },{
//         $inc: {
//             age:1
//         }
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

    db.collection("tasks").updateMany({
        completed: false
    },{
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})
