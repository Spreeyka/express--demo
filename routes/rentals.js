const {Rental, validate} = require('../models/rental'); 
const {Game} = require('../models/game'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');


router.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //bez tego nie dziala lol, cors policy error
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); //bez tego nie dalo sie usuwac, xD
  next(); 
});


Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});


router.post('/', async (req, res) => {                                      
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);        
                                                                          

  const customer = await Customer.findById(req.body.customerId);               //	"customerId": "5bfa1b2ebbd5ad2900338209",    
  if (!customer) return res.status(400).send('Invalid customer.');

  const game = await Game.findById(req.body.gameId);          //"gameId": "5bf1e5925ef8b521f8d691f3"
  if (!game) return res.status(400).send('Invalid game.');     

  if (game.numberInStock === 0) return res.status(400).send('Game not in stock.');

  let rental = new Rental({ 
    
      customerId: customer._id,
      gameId: game._id,
      dailyRentalRate: game.dailyRentalRate
    
  });
  try{
  new Fawn.Task() //transakcja
      .save('rentals', rental) //zapisujemy to wypozyczenie
      .update('games' , {_id: game._id}, {$inc: {numberInStock: -1}}) //update liczby dostepnych sztuk
      //mozemy tez usunac przy pomocy .remove
      .run();

  res.send(rental);
  }
  catch(ex) 
  {
    res.status(500).send('Something failed during transaction');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 