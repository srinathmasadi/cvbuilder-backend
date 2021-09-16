const Resume = require('../models/resume')
const jwt = require('jsonwebtoken')

exports.resumebuilder = function (req, res) {
    const {  userid, fullname, position,email,mobile,address,skills,profile,linkedin,facebook,instagram,languages,objective,experience,project,certification,education } = req.body
    
    Resume.findOne({ email }, function (err, resumeExistingUser) {
      if (err) {
        return res.status(422).json({ 'error': 'Oops! Something went Wrong' })
      }
      if (resumeExistingUser) {
        return res.status(422).json({ 'error': 'User already exists' })
      }
      else {
        const resume = new Resume({
          userid, fullname, position,email,mobile,address,skills,profile,linkedin,facebook,instagram,languages,objective,experience,project,certification,education
        })
  
        resume.save(function (err) {
          if (err) {
            return res.status(422).json({
              'error': 'Oops! Something went wrong'
            })
          }
          return res.status(200).json({ 'resumeregistered': true })
        })
      }
    })
   }
  
   exports.authMiddlewareR = function (req, res, next) {
    const json_token = req.headers.authorization
    try {
      if (json_token) {
        const user = parseToken(json_token)
        Resume.findById(user.userId, function (err, user) {
          if (err) {
            return res.status(422).json({
              'error': 'Oops! Something went wrong'
            })
          }
          if (user) {
            res.locals.user = user
            next()
          }
          else {
            return res.status(422).json({ 'error': 'Not authorized user' })
          }
        })
      }
      else {
        return res.status(422).json({ 'error': 'Not authorized user' })
      }
    } catch (err) {
      res.status(403).json({
        success: false,
        message: err
      })
    }
  }
  