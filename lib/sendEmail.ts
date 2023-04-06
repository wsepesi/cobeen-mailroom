import { Package } from './types'
import nodemailer from 'nodemailer'

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
const COBEEN_EMAIL = "cobeenmail@gmail.com"

// TODO: refactor to this ? https://mjml.io/try-it-live
const getEmailContent = (pkg: Package): string => {
    return (
    `Hello ${pkg.First},

This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the Cobeen mailroom in the first floor lobby. The mailroom is open on weekdays from 11a-3p and 5p-7p, on Saturdays 11a-3p, and on Sundays 5p-7p. Be prepared to provide your student ID to be able to pick up your pacakge. Please let the front desk know if you have any questions!

Best,
Cobeen Hall Desk Staff`)
}

const sendEmail = async (pkg: Package) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: COBEEN_EMAIL,
          pass: process.env.COBEEN_GMAIL_PASS 
        }
      });

    const verified = await transporter.verify() //function (error, success) {
    //     if (error) {
    //         console.log(error);
    //         throw new Error("transporter verification failed");
    //     }
    // });

    if (!verified) {
        throw new Error("transporter verification failed");
    }

    const mailOptions = {
        from: COBEEN_EMAIL,
        to: pkg.Email,
        subject: "Package Available for Pickup",
        text: getEmailContent(pkg),
        replyTo: DOMINIC_EMAIL,
        dsn: {
            id: '53201',
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: DOMINIC_EMAIL
        }
    }

    const res = await transporter.sendMail(mailOptions) //, (error, info) => {
    //     if (error) {
    //         console.log(error);
    //         throw new Error("transporter sendMail failed");
    //     } 
    // });
    if (res.rejected.length > 0) {
        throw new Error("transporter sendMail failed");
    }

    // if (res.accepted.length === 0) {
    //     throw new Error("transporter sendMail failed");
    // }
}

export default sendEmail