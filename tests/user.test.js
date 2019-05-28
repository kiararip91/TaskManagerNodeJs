const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name:"Mike",
    email:"mike@gmail.com",
    password:"pippo123"
}

beforeEach(async () => {
    await User.deleteMany({})
    await new User(userOne).save()
})

// beforeAll(() => {

// })

// afterEach(() => {
    
// })

test('Should signup a new user', async ()=> {
    await request(app).post('/users').send({
        name: "Andrew",
        email: "asdfg@gmail.com",
        password: "myPass123"
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should fail login user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "badCredentials"
    }).expect(400)
})