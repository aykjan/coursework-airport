const { Router } = require("express");
const Ticket = require('../modules/ticket')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
    res.render('add', {
        departureCity: 'Добавить билет',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {
    // console.log(req.body) // Тут выводится вся инфа которое мы написали в форуме 


    // const ticket = new Ticket (req.body.departureCity, req.body.arrivalCity, req.body.airplaneName)
    const ticket = new Ticket({
        departureCity: req.body.departureCity,
        arrivalCity: req.body.arrivalCity,
        airplaneName: req.body.airplaneName,
        userId: req.user._id 
    })

    try {
        await ticket.save()
        res.redirect('/tickets')
    } catch (e) {
        console.log(e)
    }


})


module.exports = router