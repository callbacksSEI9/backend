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
const router = express.Router()

//require model user
const User = require('../models/user')


//index route
//method get
// router.get('/departments',requireToken,(req,res,next)=>{
//     Department.find({owner: req.user.id})
//     .then(departments => res.status(200).json({departments:departments}))
//     .catch(next)
// })
//show route
//method get
router.get('/departments',(req,res,next)=>{
    let employees=[]
    Department.findById("5e395ded1a26b34da878b55f")
    .then(handle404)
    // .then(department => {
    //     // requireOwnership(req,department)
    //     // return department
    // })
    .then(department => {
         department.employees.forEach(employee =>{
            User.findOne({_id:employee})
            .then((employee)=>{
                 employees.push(employee)// here you are trying to save the employee inside employees array to list it
                 return employees
            }).then((employees)=>{
                res.status(200).json({employees:employees})
            })
        })
        // return employees
    })
    
    .catch(next)
})

//create route
//method post
// router.post('/departments',requireToken,(req,res,next)=>{
//     // req.body.department.owner = req.user._id
//     const userId = req.user._id
//     const newDepartment = req.body.department
//     newDepartment.owner = userId
//     Department.create(newDepartment)
//     .then(department =>{
//         res.status(201).json({department: department.toObject()})
//     })
//     .catch(next)
// })

//creat employee in department route
//method post
router.post('/departments/:departmentId', (req, res,next)=> {
    let employee
    // const departmentId = req.params.departmentId
    
    // .then((department)=> {
        createEmployee = User.findOne({email: req.body.credentials.email})
        .then(record =>{
            // if we didn't find a user with that email, send 401
        if (!record) {
            throw new BadCredentialsError()
        }
        employee = record._doc //after finding the user we want to add as employee save it in employee variable
        })
    //find the department we want to add employee to it
    Department.findOne({_id:req.params.departmentId})
    .then((department)=> {
        //push employee in department's employees array
        department.employees.push(employee)
        return department
    })
    //save changes in department
    .then(department => department.save()) 
        .then((employeeAddedToDepartment)=> {
            res.status(201).json({department:employeeAddedToDepartment.toObject()})
        })
    .catch(next)
})

//update route
//method patch
// router.patch('/departments/:department_id',requireToken,(req,res,next)=>{
//     delete req.body.department.owner
//     Department.findById(req.body.department_id)
//     .then(handle404)
//     .then(department =>{
//         requireOwnership(req,department)
//         return department.update(req.body.department)
//     })
//     .then(()=>res.status(204))
//     .catch(next)
// })

//delete route
//method delete
// router.delete('/departments/:department_id',requireToken,(req,res,next)=>{
//     Department.findById(req.params.department_id)
//     .then(handle404)
//     .then(department => {
//         requireOwnership(req,department)
//         department.remove()
//     })
//     .then(()=> res.sendstatus(204))
//     .catch(next)
// })

module.exports = router