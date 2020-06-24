const {Customer, validate} = require('../models/customer'); //zebysmy nie musieli pisac za kazdym razem customer.coś
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



router.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //bez tego nie dziala lol, cors policy error
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); //bez tego nie dalo sie usuwac, xD
  next(); 
});

router.get('/', async(req, res) =>
{
    const customers = await Customer.find().sort('name');
    res.send(customers);   //route handler
});

router.post('/', async (req, res) =>                            //route handler to add a game with some basic validation
{                                                               //using joi library to validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isPremium: req.body.isPremium
    });
    await customer.save(); //zapisujemy w database
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        isPremium: req.body.isPremium,
        phone: req.body.phone
      }, { new: true });
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);
  });
  
  router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });
  
  router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });

module.exports = router;