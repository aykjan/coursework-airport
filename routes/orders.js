const { Router, request } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Order = require('../modules/order')


router.get('/', auth, async (req, res) => {
   try {
      const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')

      res.render('orders', {
         title: 'Заказы',
         isOrder: true,
         orders: orders.map(o => {
            return {
               ...o._doc,
               price: o.tickets.reduce((total,c) => {
                  return total += c.count * c.ticket.price
               }, 0 )
            }
         })
      })
   } catch (e) {
      console.log(e)
   }
   
})

router.post('/', auth, async (req, res) => {
   try {
      const user = await req.user.populate('cart.items.ticketId')
      const tickets = user.cart.items.map(i => ({
         count: i.count,
         ticket: { ...i.ticketId._doc }
      }))

      const order = new Order ({
         user: {
            name: req.user.name,
            userId: req.user
         },
         tickets: tickets

      })
      await order.save()
      await req.user.clearCart()


      res.redirect('/orders')
   } catch (e) {
      console.log(e)
   }


})

module.exports = router