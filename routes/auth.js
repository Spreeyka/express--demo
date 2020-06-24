const Joi = require('joi');
const bcrypt = require('bcryptjs'); //LOGOWANKO
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //bez tego nie dziala lol, cors policy error
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); //bez tego nie dalo sie usuwac, xD
  next(); 
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password); //compare zwraca true jesli sie zgadzają 
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken(); //wylogowywanie powinno byc po stronie klienta a nie serwera, bo nigdzie nie zapisujemy tokena
  res.send(token);       //zwracamy token jesli logowanie sie powiodlo. W tokenie moze byc nawet czy jest adminem czy nie
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(), //walidacja emaila ;)
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
