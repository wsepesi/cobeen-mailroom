import { MARQUETTE_EMAIL } from './CONFIG'
import { Package } from './types'
import nodemailer from 'nodemailer'

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
// const COBEEN_EMAIL = "cobeenmail@gmail.com"
const COBEEN_EMAIL = ""

// const getEmailContent = (pkg: Package): string => {
//     return (
//     `Hello ${pkg.First},

// This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the Mashuda Hall mailroom. Be prepared to provide your student ID to be able to pick up your package. 

// The mailroom is open Monday - Friday, 11am-3pm and 5-7pm, Saturday 11am-3pm, and Sunday 5-7pm.

// Please let the front desk know if you have any questions!

// Best,
// Desk Staff`)
// }

// TODO: refactor to this ? https://mjml.io/try-it-live
const getEmailContent = (pkg: Package): string => {
    return (
    `Hello ${pkg.First},

This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the Cobeen Hall mailroom in the first floor lobby. The mailroom is open on weekdays from 11a-3p and 5p-7p, on Saturdays 11a-3p, and on Sundays 5p-7p. Be prepared to provide your student ID to be able to pick up your pacakge. Please let the front desk know if you have any questions!

Best,
Cobeen Hall Desk Staff`)
}

const sendEmail = async (pkg: Package) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: MARQUETTE_EMAIL,
          pass: process.env.MARQUETTE_GMAIL_PASS 
        }
      });

    const verified = await transporter.verify()

    if (!verified) {
        throw new Error("transporter verification failed");
    }

    const mailOptions = {
        from: MARQUETTE_EMAIL,
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

    const res = await transporter.sendMail(mailOptions) 
    if (res.rejected.length > 0) {
        throw new Error("transporter sendMail failed");
    }
}

export default sendEmail