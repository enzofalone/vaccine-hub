const express = require('express');
const {
    restart
} = require('nodemon');
const User = require('../models/user');
const router = express.Router();

router.post('/login', async (req, res, next) => {
    try {
        //take user email and password to log in into app
        const user = await User.login(req.body);
        return res.status(200).json({
            user
        });
    } catch (err) {
        next(err);
    }
})

router.post('/register', async (req, res, next) => {
    try {
        //take the users email, password
        //and create a new user in our database
        const user = await User.register(req.body);
        return res.status(201).json({
            user
        });
    } catch (err) {
        next(err);
    }
})

module.exports = router;