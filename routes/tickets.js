const { Router } = require("express");
const Ticket = require('../modules/ticket');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
    const tickets = await Ticket.find().populate('userId', 'email name').select('departureCity arrivalCity airplaneName price');
    res.render('tickets', {
        title: 'Билеты',
        isTickets: true,
        tickets
    });
});

router.get('/add', auth, (req, res) => {
    res.render('ticket-add', {
        title: 'Добавить новый билет'
    });
});

router.post('/add', auth, async (req, res) => {
    const { departureCity, arrivalCity, airplaneName, price } = req.body;
    const ticket = new Ticket({
        departureCity,
        arrivalCity,
        airplaneName,
        price, 
        userId: req.user._id
    });

    try {
        await ticket.save();
        res.redirect('/tickets');
    } catch (error) {
        console.log(error);
        res.redirect('/add');  // Возвращаем пользователя обратно на форму добавления в случае ошибки
    }
});

router.get('/:id', auth, async (req,res) => {
    const ticket = await Ticket.findById(req.params.id)
    res.render('ticket', {
        title: 'Билет',
        ticket
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
       return res.redirect('/');
    }
    const ticket = await Ticket.findById(req.params.id);
    res.render('ticket-edit', {
        title: 'Редактировать билет',
        ticket
    });
});

router.post('/edit', auth, async (req, res) => {
    const { id } = req.body;
    delete req.body.id;
    await Ticket.findByIdAndUpdate(id, req.body);
    res.redirect('/tickets');
});

router.post('/remove', auth, async (req, res) => {
    const { id } = req.body; // Проверка, что id передается правильно
    await Ticket.deleteOne({ _id: id });
    res.redirect('/tickets');
});



module.exports = router;
