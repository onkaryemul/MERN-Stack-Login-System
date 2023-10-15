import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
// import { jwt } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


/* middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        // Check the user existance 
        const exist = await UserModel.findOne( {username} );
        if( !exist ) {
            return res.status(404).send( {error : "Can't find User!"} );
        }

        next();

    } catch (error) {
        return res.status(404).send( { error: "Authentication Error"} );
    }
}


/* POST: http://localhost:3000/api/register */
/**
 * @param : {
 *    "username" : "example123",
 *    "password" : "admin123",
 *    "email" : "example@gmail.com",
 *    "firstName" : "bill",
 *    "lastName" : "william",
 *    "mobile" : 8009860560,
 *    "address" : "Apt. 856, Kulas Light, Gwenborough",
 *    "profile" : ""
 * }
 */
export async function register(req, res) {
    // res.json('register route');
    console.log('Entering register function');
    try {
        const { username, password, profile, email } = req.body;
   
        // Check for existing user
        const existUsername = UserModel.findOne({username})
                              .then(user => {
                                    if (user) {
                                       throw { error: "Please use a unique username" };
                                    }
                               });

        // Check for existing email
        const existEmail = UserModel.findOne({ email })
                            .then(existingEmail => {
                                    if (existingEmail) {
                                       throw { error: "Please use a unique email" };
                                    }
                             });

        
        Promise.all( [existUsername, existEmail] )
           .then(() => {
                if(password) {
                    bcrypt.hash(password, 10)
                       .then( hashedPassword => {
                        
                           const user = new UserModel({
                               username: username,
                               password: hashedPassword,
                               profile: profile || '',
                               email: email
                           });
                        
                           // return & save result as a response
                           user.save()
                               .then(result => res.status(201).send({
                                   msg: "User Register Successfully!"
                               }))
                               .catch(error => res.status(500).send({error}));

                       }).catch(error => {
                           return res.status(500).send({
                                error : "Unable to hash Password"
                           });
                       })
                }
           }).catch(error => {
                console.error('Error in registration:', error);
                return res.status(500).send(error);
           });

    } catch (error) {
        console.error('Error in register function:', error);
        return res.status(500).send(error);
    }
    
}


/* POST: http://localhost:3000/api/login */
/* @param: {
 *   "username" : "example123",
 *   "password" : "admin123"
 }
 */
export async function login(req, res) {
    // res.json('login route');

    const { username, password } = req.body;

    try {
       
        UserModel.findOne({ username })
            .then(user => {

                if (!user) {
                    return res.status(404).send({ error: "Username not found" });
                }

                bcrypt.compare(password, user.password)
                   .then(passwordCheck => {
                       
                       if( !passwordCheck ) {
                          return res.status(400).send({ error : "Don't have Password"});
                       }

                       // Create JWT (JSON Web Token) Token --> access token
                       const token = jwt.sign(
                                          // Payload
                                       {
                                          userId : user._id,
                                          username: user.username 
                                       },
                                          ENV.JWT_SECRET,  // JWT secrets
                                       {
                                          expiresIn: "24h"  // Expires in
                                       }
                                    );

                       return res.status(200).send({
                           msg: "Login Successful...!",
                           username: user.username,
                           token,
                       });

                   })
                   .catch(error => {
                       return res.status(400).send({ error : "Password does not Match"});
                   });
            })
            .catch(error => {
                return res.status(404).send({ error : "Username not found"});
            });

    } catch (error) {
        return res.status(500).send({error});
    }

}


/* GET: http://localhost:3000/api/user/example123 */
export async function getUser(req, res) {
    // res.json('getUser route');
    
    const { username } = req.params;

    try {
        if(!username) {
            return res.status(501).send( { error: "Invalid Username"});
        }

        UserModel.findOne({ username })
             .then(user => {

                if(!user) {
                   return res.status(501).send( {error: "Couldn't Find the User"} );
                }

                /* remove password from user */
                // mongoose return unneccessary data with object to convert it into json
                const { password, ...rest } = Object.assign({}, user.toJSON());

                return res.status(201).send(rest);
             })
             .catch(err => {
                return res.status(500).send({ err });
             });

    } catch (error) {
        return res.status(404).send( { error: "Cannot Find User Data"});
    }

}


/* PUT: http://localhost:3000/api/updateuser */
/* @param: {
    "id": "<userid>"  // "id": "<token>" // "header": "<token>" 
}
body: {
    firstName: '',
    address: '',
    profile: ''
}
 */
export async function updateUser(req, res) {
    // res.json('updateUser route');
    try {
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId) {
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id: userId }, body)
                .then(data => {
                    // Check if any document was matched and modified
                    if (data) {
                        return res.status(200).send({ msg: "User updated successfully" });
                    } else {
                        return res.status(404).send({ error: "User not found or not modified" });
                    }
                })
                .catch(error => {
                    return res.status(500).send({ error: error.message || "Internal Server Error" });
                });

        } else {
            return res.status(401).sen( {error: "User Not found...!"});
        }

    } catch (error) {
        // console.log(error);
        return res.status(401).send( {error} );
    }
}


/* GET: http://localhost:3000/api/generateOTP */
export async function generateOTP(req, res) {
    // res.json('generateOTP route');
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false } );

    res.status(201).send( { code: req.app.locals.OTP } );
}


/* GET: http://localhost:3000/api/verifyOTP */
export async function verifyOTP(req, res) {
    // res.json('verifyOTP route');
    const { code } = req.query;

    // Logging for debugging
    // console.log('Stored OTP:', req.app.locals.OTP);
    // console.log('Received OTP:', code);

    if( parseInt(req.app.locals.OTP) === parseInt(code) ) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password

        return res.status(201).send( {msg: "Verified Successfully!"} );
    }

    return res.status(400).send( {error: "Invalid OTP"} );
}


// successfully redirect user when OTP is valid
/* GET: http://localhost:3000/api/createResetSession */
export async function createResetSession(req, res) {
    // res.json('createResetSession route');
    if(req.app.locals.resetSession) {
        return res.status(201).send( { flag: req.app.locals.resetSession } );
    }

    return res.status(440).send( { error: "Session expired!" });
}


// update the password when we have valid session
/* PUT: http://localhost:3000/api/resetPassword */
export async function resetPassword(req, res) {
    // res.json('resetPassword route');
    try {

        if( !req.app.locals.resetSession ) {
            return res.status(440).send({error: "Session expired!"});
        }

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({username})
                .then(user => {

                    bcrypt.hash(password, 10)
                       .then(hashedPassword => {

                            UserModel.updateOne( {username: user.username}, {password: hashedPassword} )
                                .then(data => {
                                    // Check if any document was matched and modified

                                    req.app.locals.resetSession = false;

                                    return res.status(201).send({ msg: "Record Updated...!" });
                                })
                                .catch(error => {
                                    return res.status(501).send({error: "Unable to update the password"});
                                });

                       })
                       .catch(error => {
                            return res.status(500).send({error: "Unable to hash password"});
                       });

                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not Found"});
                });

        } catch (error) {
            return res.status(500).send({error});
        }

    } catch (error) {
        return res.status(401).send({error});
    }
}


