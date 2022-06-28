const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NotFoundError } = require('./utils/errors');
const { PORT } = require('./config');
const authRoutes = require('./routes/auth');

//init express
const app = express()

//enables cross-origin resource sharing for all origins
app.use(cors());

// parse incoming request bodies with JSON payloads
app.use(express.json());

//log request info
app.use(morgan('tiny'));

// set up authentication router
app.use('/auth', authRoutes);

// generic error handling (404)
app.use((req, res, next) => {
    return next(new NotFoundError());
})

// generic error handling: Unhandled errors (500)
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error: { message, status }
    })
})

//initialize server. listen at PORT
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} 🚀`);
})