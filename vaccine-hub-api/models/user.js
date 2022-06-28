const {UnauthorizedError} = require('../utils/errors');

class User {
    static async login(credentials) {
        // user should submit their email and password
        // if any fields are missing, throw an error
        
        // look up the user in the db by email
        // if a user is found, compare the submitted password
        // with the password in the db
        // if there is a match, return the user

        //if any of this goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo");
    }

    static async register(credentials) {
        // user should submit email, password, and (other data)
        // if any fields are missing, throw an error

        // make sure no user already exists in the system with the same email
        // if it does throw an error

        // take the user password, and hash it for security purposes
        // take the users email, and lowercase it

        //return user
    }
}

module.exports = User