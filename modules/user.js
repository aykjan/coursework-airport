const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        ticketId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ticket',
          required: true
        },
        count: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(ticket) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.ticketId.toString() === ticket._id.toString();
  });

  if (cartProductIndex >= 0) {
    // Если тикет уже в корзине, увеличиваем количество
    this.cart.items[cartProductIndex].count++;
  } else {
    // Иначе, добавляем новый тикет в корзину
    this.cart.items.push({
      ticketId: ticket._id,
      count: 1
    });
  }

  return this.save();
}

userSchema.methods.removeFromCart = function(id) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.ticketId.toString() !== id.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
