const {Schema, model} = require('mongoose')

const ticket = new Schema({
  departureCity: {
    type: String,
    required: true
  },
  arrivalCity: {
    type: String,
    required: true
  },
  airplaneName: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

ticket.method('toClient', function() {
  const ticket = this.toObject()

  ticket.id = ticket._id 
  delete ticket._id 

  return ticket
})

module.exports = model('Ticket', ticket)