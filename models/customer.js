const mongoose = require('mongoose');
const Joi = require('joi');   

const Customer= mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 50
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 50
    }
}));

function ValidateCustomer(customer)
{
    const schema =
    {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isPremium: Joi.boolean()            
    };
    return Joi.validate(customer,schema);
}

exports.Customer = Customer;
exports.validate = ValidateCustomer; //exporty