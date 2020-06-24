const mongoose = require('mongoose');
const Joi = require('joi');  
const {genreSchema} = require('./genre');


const Game= mongoose.model('Game', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 50
    },
    genre: {
        type: genreSchema,
        required: false                //A TO REPREZENTACJA MODELU GRY W APLIKACJI
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0, // walnac sobie tablice rezerwacji     // i tutaj dodac rentals: { type:Array }?? 
        max: 255                                     // i pushować cos do niej za kazdym razem
    }                                               //jak mamy post jakiegos rentala to mamy do niej pushowac?
}))



function ValidateGame(game)                                                         
{
    const schema = {                                        // INPUT DO API
        title: Joi.string().min(3).max(50).required(), //TO JEST walidacja dla klienta. diff from above
        genreId: Joi.objectId().required(),            //klient wysyla tylko ID
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()          
    };
    return Joi.validate(game,schema);
}

exports.Game = Game;
exports.validate = ValidateGame;