const {Router} = require('express')
const Ticket = require('../modules/ticket')
const auth = require('../middleware/auth')
const router = Router()

function mapTickets (cart) {
    return cart.items.map(t => ({
        ...t.ticketId._doc, 
        id: t.ticketId.id,
        count: t.count
    }))
}

function computePrice(tickets) {
    return tickets.reduce((total, ticket) => {
        return total += ticket.price * ticket.count
    }, 0)
}

router.post('/add', auth,  async  (req,res) => {
    const ticket = await Ticket.findById(req.body.id)
    await req.user.addToCart(ticket)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req,res) => {
   await req.user.removeFromCart(req.params.id)
   const user = await req.user.populate('cart.items.ticketId')

   const tickets = mapTickets(user.cart)

   const cart = {
    tickets, price: computePrice(tickets)
   }
    
   
   res.status(200).json(cart)
})
router.get('/', auth, async (req,res) => {
    const user = await req.user
    .populate('cart.items.ticketId')

    const tickets = mapTickets(user.cart)
    
    res.render('card', {
        title: 'Корзина',
        isCard: true, 
        tickets: tickets,
        price: computePrice(tickets)
    })

})
module.exports = router