const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  parts: [{
      title: String,
      time: Number
  }]
  ,
  status:{
    type: String,
  },
  time: {
      type: String
  },
}, 
{
  timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)
