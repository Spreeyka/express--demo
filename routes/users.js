const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //bez tego nie dziala lol, cors policy error
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); //bez tego nie dalo sie usuwac, xD
  next(); 
});


router.get('/me', auth, async (req, res) => { //sprawdzamy przez middleware function czy jest userem
  const user = await User.findById(req.user._id).select('-password'); //haslo no needed?
  res.send(user);
});

router.post('/', async (req, res) => { //register a user
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt); //haszowanie hasla z random stringiem z 10 elementow
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); //mozemy to zapisac po stronie klienta i next
  //time gdy bedziemy robic api call bedziemy to wysylac do serwera
});

module.exports = router; 
