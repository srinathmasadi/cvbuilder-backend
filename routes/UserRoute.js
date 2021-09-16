const express = require('express')
const user = require('../controllers/UserController')
const resume = require('../controllers/ResumeController')
const router = express.Router()

const { authMiddleware } = require('../controllers/UserController')
const { authMiddlewareR } = require('../controllers/ResumeController')

router.post('/register', user.register)

router.patch('/update', user.update)

router.post('/login', user.login)

router.get('/profile', authMiddleware, function (req, res) {
  res.json({ 'access': true })
})

// router.post('/resume', resume.resumebuilder)

router.get('/template', function (req, res) {
  res.json({ 'access': true })
})

module.exports = router
