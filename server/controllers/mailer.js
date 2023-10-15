import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

// https://ethereal.email/create
const nodeConfig = { 
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
       user: ENV.EMAIL,
       pass: ENV.PASSWORD
    }
};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
});



/* POST: http://localhost:3000/api/registerMail */
/* @param: {
 *   "username" : "example123",
 *   "userEmail" : "admin123@gmail.com",
 *   "text" : "Testing Mail",
 *   "subject"  :  "Backend API request"
 }
 */
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    const email = {
        body: {
            name: username,
            intro: text || "Welcome to Daily Tuition! We are very excited to have you on board.",
            outro: "Need help, or have questions? Just reply to this email, we would love to help."
        }
    };

    const emailBody = MailGenerator.generate(email);

    const message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send( { msg: "You should receive an email from us."} );
        })
        .catch(error => res.status(500).send( {error} ));

};
