
const express = require('express')
const passport = require('passport')

const Task = require('../models/task')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /examples
router.get('/tasks', requireToken, (req, res, next) => {
  
  Task.find({owner: req.user.id})
    .then(tasks => res.status(200).json({tasks:tasks}))
    .catch(next)
  
})

// SHOW
router.get('/tasks/:id', requireToken, (req, res, next) => {
  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      requireOwnership(req, task)
    
      res.status(200).json({ task: task.toObject() })
    })
    .catch(next)
})

// CREATE
// POST /examples
router.post('/tasks', requireToken, (req, res, next) => {
  console.log('xxxx')
  const userId = req.user._id
  const newTask = req.body.task
  newTask.owner = userId
  console.log(newTask)
  Task.create(newTask)
    .then(task => {
      res.status(201).json({ task: task.toObject() })
    })
   .catch(next)
})

// UPDATE

router.patch('/tasks/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.task.owner

  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      requireOwnership(req, task)

      return task.update(req.body.task)
    })
    .then(() => res.status(204))
    .catch(next)
})

// DESTROY

router.delete('/tasks/:id', requireToken, (req, res, next) => {
    Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      
      requireOwnership(req, task)
     
      task.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router