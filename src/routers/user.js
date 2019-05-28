const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendGoodByeEmail} = require('../email/account')

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByUserCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    user.tokens = user.tokens.concat({token})
    await user.save()
    res.send({user, token})
  } catch (error) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token != req.token
    })

    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

// Create new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    user.tokens = user.tokens.concat({token})
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send('An error occurred ' + error)
  }
  // user.save().then(() => {
  //     res.status(201).send(user)
  // }).catch((error) => {
  //     res.status(400).send('An error occurred ' + error)
  // })
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'age', 'password', 'email']
  const validOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
})

  if (!validOperation) {
    return res.status(400).send({error: 'Invalid Updates!'})
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])

    await req.user.save()
    // I can t use this line to update the user beacuse it does not fire the save user event and it does not hash the password!
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true}
    res.send(req.user)
  } catch (error) {
    res.status(400).send()
  }
})


router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    sendGoodByeEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(400).send(error)
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be an Image'))
    }

    cb(undefined, true)
    // cb(new Error('File must be a PDF'))
    // cb(undefined, true)
    // cb(undefined, false)
  },
})

router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(400).send()
  }
})

module.exports = router
