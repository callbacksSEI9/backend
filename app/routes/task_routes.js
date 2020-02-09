
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

router.post('/gettasks', requireToken, (req, res, next) => {
  if (req.body.status == 'none'){
  Task.find()
    .then(tasks => res.status(200).json({tasks:tasks}))
    .catch(next)
  }
  else{
    Task.find({status: req.body.status})
    .then(tasks => res.status(200).json({tasks:tasks}))
    .catch(next)
  }
  
})

// SHOW
router.post('/tasks/:id', requireToken, (req, res, next) => {
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
router.post('/newtasks', requireToken, (req, res, next) => {
  const userId = req.user._id
  const newTask = req.body.task
  newTask.owner = userId
  newTask.status = 'Queued'
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