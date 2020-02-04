const mongoose = require('mongoose')
import TaskModel from './task'

const ReportSchema = new mongoose.Schema({
    tasks: []
}, {
    timestamps: true
})

module.exports = mongoose.model('Report', ReportSchema)
