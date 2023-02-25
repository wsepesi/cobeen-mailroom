import { Package } from './types'
import nodemailer from 'nodemailer'

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
const WILLIAM_EMAIL = "wesepesi@gmail.com"
const COBEEN_EMAIL = "cobeenmail@gmail.com"

// TODO: refactor to this ? https://mjml.io/try-it-live
const getEmailContent = (pkg: Package): string => {
    return (
    `Hello ${pkg.First},

This email is to notify you that you have a package with ID #${pkg.packageId} delivered by ${pkg.provider} to pick up in the Cobeen mailroom in the first floor lobby. The mailroom is open on weekdays from 11a-3p and 5p-7p, on Saturdays 11a-3p, and on Sundays 5p-7p. Please let the front desk know if you have any questions!

Best,
Cobeen Hall Desk Staff`)
}

const sendEmail = async (pkg: Package) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: COBEEN_EMAIL, //WILLIAM_EMAIL,
          pass: process.env.COBEEN_GMAIL_PASS //process.env.WS_GMAIL_PASS,
        }
      });

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            throw new Error("transporter verification failed");
        }
    });

    const mailOptions = {
        from: WILLIAM_EMAIL, // TODO: refactor to custom acct
        to: WILLIAM_EMAIL, //DOMINIC_EMAIL, // TODO: refactor to pkg.Email
        subject: "Package Available for Pickup",
        text: getEmailContent(pkg),
        replyTo: DOMINIC_EMAIL,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            throw new Error("transporter sendMail failed");
        } 
    });
}

export default sendEmail