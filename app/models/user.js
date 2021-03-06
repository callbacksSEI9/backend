const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  token: String,
  name: {
    type: String,
    required: true
  },
  master:{
    type: Boolean,
    required: true,
    default: false
  },
  manager:{
    type: Boolean,
    required: true,
    default: false
  },
  assigned:{
    type: Boolean,
    required: true,
    default: false
  }
}, 
{
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

userSchema.virtual('examples', {
  ref: 'Example',
  localField: '_id',
  foreignField: 'owner'
});

module.exports = mongoose.model('User', userSchema)
