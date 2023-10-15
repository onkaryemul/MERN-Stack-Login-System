import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/* authentication middleware */
export default async function auth(req, res, next) {
    try {
       // access authorize header to validate request
       const token = req.headers.authorization.split(" ")[1];

       if (!token) {
          return res.status(401).json({ error: 'No token provided. Authentication failed!' });
       }

       // retrieve the user details for the logged in user
       const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

       req.user = decodedToken;
    // res.json(decodedToken);

       next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired. Authentication failed!' });
        }
        res.status(401).json( {error: 'Authentication Failed!'});
    }

}


/* middleware for local variables */
export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };

    next();
}
