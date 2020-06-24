const Joi = require('joi');
const mongoose = require('mongoose');


const Rental = mongoose.model('Rental', new mongoose.Schema({
  customerId: {                         //to tez zostawic
    type: String,
    required: true    
  },
  gameId: {                              //czyli mam wywalić tylko to?
    type: String,
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now               //i zostawic te 3 ?
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    gameId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;