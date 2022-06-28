const {
    BadRequestError,
    UnauthorizedError
} = require('../utils/errors');
const db = require('../db');
const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR} = require('../config');
class User {
    static async login(credentials) {
        // user should submit their email and password
        // if any fields are missing, throw an error
        const requiredFields = ['email', 'password'];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body!`)
            }
        })
        // look up the user in the db by email
        const user = await User.fetchUserByEmail(credentials.email);
        // if a user is found, compare the submitted password
        // with the password in the db
        // if there is a match, return the user
        if(user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if(isValid) {
                return user
            }
        }

        //if any of this goes wrong, throw an error at the end as no returns where made
        throw new UnauthorizedError("Invalid email/password combo");
    }

    static async register(credentials) {
        // user should submit email, password, and (other data)
        // if any fields are missing, throw an error
        const requiredFields = ['email', 'password', 'first_name', 'last_name', 'location'];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body!`)
            }
        })
        // check if email is valid
        if(credentials.email.indexOf("@") <= 0) {
            throw new BadRequestError("Email is not valid:", credentials.email);
        }

        // make sure no user already exists in the system with the same email
        // if it does throw an error
        const existingUser = await User.fetchUserByEmail(credentials.email);

        if (existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        // take the user password, and hash it for security purposes
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);
        // take the users email, and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase();

        //create a new user in the db to save all their info
        const result = await db.query(
            `INSERT INTO users (
                email,
                password,
                first_name,
                last_name,
                location
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id, email, first_name, last_name, location;`,
            [lowercasedEmail, hashedPassword, credentials.first_name, credentials.last_name, credentials.location])

        //return user
        const user = result.rows[0];
        
        return user
    }

    static async fetchUserByEmail(email) {
        // check if argument is empty
        if (!email) throw new BadRequestError("No email provided");

        //query email provided
        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()]);

        //pick first result
        const user = result.rows[0];

        // return user provided by DB
        return user
    }
}

module.exports = User