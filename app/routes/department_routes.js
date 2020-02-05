// Express docs: http://expressjs.com/en/api.html
const express = require("express")
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport")
// pull in Mongoose model for departments
const Department = require("../models/department")
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors")
const BadCredentialsError = customErrors.BadCredentialsError
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
const router = express.Router()

//require model user
const User = require('../models/user')

router.get('/departments',requireToken,(req,res,next)=>{
    let employees=[]
    Department.find({owner: req.user._id})
    .then(handle404)
    .then((department)=> {
// console.log(department[0]._doc.owner)
// requireOwnership(req,department[0]._doc)
        return department
    })
    .then(department => {
        department[0]._doc.employees.forEach(function(employee) {
            employees.push( User.findOne({_id:employee}));
        });
        Promise.all(employees).then(function(responses) {
// responses will come as array of them
// return json file after everything finishes
           res.status(200).json({responses:responses})
        }).catch(function(reason) {
// catch all the errors
           console.log(reason);
        })
        return employees
    })
    .catch(next)
})

//creat employee in department route
//method post
router.post('/departments',requireToken, (req, res,next)=> {
    let employee
     User.findOne({email: req.body.credentials.email})
    .then(record =>{
// if we didn't find a user with that email, send 401
        if (!record) {
            throw new BadCredentialsError()
        }
//after finding the user we want to add as employee save it in employee variable
        employee = record._doc 
        })
//find the department we want to add employee to it
    Department.find({owner: req.user.id})
    .then((department)=> {
//push employee in department's employees array
        department[0]._doc.employees.push(employee)
        return department
    })
//save changes in department
    .then(department => department[0].save()) 
        .then((employeeAddedToDepartment)=> {
            res.status(201).json({department:employeeAddedToDepartment.toObject()})
        })
    .catch(next)
})

module.exports = router