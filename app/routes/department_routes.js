// Express docs: http://expressjs.com/en/api.html
const express = require("express")
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport")
// pull in Mongoose model for departments
const Department = require("../models/department")
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors")
// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate("bearer",{session:false})
// instantiate a router (mini app that only handles routes)
const router = express.Router

//index route
//method get
router.get('/departments',requireToken,(req,res,next)=>{
    Department.find()
    .then(departments => res.status(200).json({departments:departments}))
    .catch(next)
})

router.get('/departments/:department_id',requireToken,(req,res,next)=>{
    Department.findById(req.params.department_id)
    .then(handle404)
    .then(department => {
        requireOwnership(req,department)
        res.status(200).json({department:department.toObject()})
    })
    .catch(next)
})

router.post('/departments',requireToken,(req,res,next)=>{
    req.body.department.owner = req.user.id
    Department.create(req.body.department)
    .then(department =>{
        res.status(201).json({department:department.toObject()})
    })
    .catch(next)
})
router.patch('/departments/:department_id',requireToken,(req,res,next)=>{
    delete req.body.department.owner
    Department.findById(req.body.department_id)
    .then(handle404)
    .then(department =>{
        requireOwnership(req,department)
        return department.update(req.body.department)
    })
    .then(()=>res.status(204))
    .catch(next)
})

router.delete('/departments/:department_id',requireToken,(req,res,next)=>{
    Department.findById(req.params.department_id)
    .then(handle404)
    .then(department => {
        requireOwnership(req,department)
        department.remove()
    })
    .then(()=> res.sendstatus(204))
    .catch(next)
})

module.exports = router