const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@gmail.com",
    password: "pippo123",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
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
    const response = await request(app).post('/users').send({
        name: "Andrew",
        email: "asdfg@gmail.com",
        password: "myPass123"
    }).expect(201)

    // Assert that the user was create correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: "Andrew",
            email: "asdfg@gmail.com"
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findOne({email: userOne.email})
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should fail login user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "badCredentials"
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for unauthenitcated user', async () => {
    await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})

test('Should delete user profile', async () => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
    const user  = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete user profile (unauthenticate user)', async () => {
    await request(app)
            .delete('/users/me')
            .send() 
            .expect(401)
})