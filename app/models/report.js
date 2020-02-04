const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    
}, {
  timestamps: true
})

module.exports = mongoose.model('Report', ReportSchema)
