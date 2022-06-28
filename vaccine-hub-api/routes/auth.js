const express = require('express');
const router = express.Router();

router.post('/login', async (req, res, next) => {
    //take user email and password to log in into app
    try {

    } catch (err) {
        next(err);
    }
})

router.post('/register', async (req, res, next) => {
    //take the users email, password
    //and create a new user in our database
    try {  

    } catch(err) {
        next(err);
    }
})

module.exports = router;