const{User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

//CONTAINER FOR MULTIPLE TESTS
describe('user.generateAuthToken', () =>{
    it('should return a valid JWT', () => {
        const payload = 
            { 
            _id: new mongoose.Types.ObjectId().toHexString(),
             isAdmin: true
            };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //w pliku config/test.json ustawiasz jwt zamiast env var
        expect(decoded).toMatchObject(payload);
    })
}) 