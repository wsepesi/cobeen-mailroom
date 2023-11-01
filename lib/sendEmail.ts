import { REPLY_TO_EMAIL, SERVICE_EMAIL } from './CONFIG'

import { Package } from './types'
import nodemailer from 'nodemailer'

// const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
// const BELLA_EMAIL = "Isabella.Buelow@marquette.edu"
// const COBEEN_EMAIL = "cobeenmail@gmail.com"
// const MARQUETTE_EMAIL = "marquettemailer@gmail.com"

// TODO: refactor to this ? https://mjml.io/try-it-live
// const getEmailContent = (pkg: Package): string => {
//     return (
//     `Hello ${pkg.First},

// This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the mailroom in the first floor lobby. The mailroom is open on weekdays from 11a-3p and 5p-7p, on Saturdays 11a-3p, and on Sundays 5p-7p. Be prepared to provide your student ID to be able to pick up your pacakge. Please let the front desk know if you have any questions!

// Best,
// Desk Staff`)
// }

const getEmailContent = (pkg: Package): string => {
    return (
    `Hello ${pkg.First},

This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the Mashuda Hall mailroom. Be prepared to provide your student ID to be able to pick up your package. 

The mailroom is open the following times:
- Monday 11-1, 5-9
- Tuesday 11-3, 5-7
- Wednesday 11-3, 5-7
- Thursday 11-5
- Friday 11-3, 5-7
- Saturday 12-3
- Sunday 12-3, 5-7

Please let the front desk know if you have any questions!

Best,
Desk Staff`)
}

const sendEmail = async (pkg: Package) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SERVICE_EMAIL, //COBEEN_EMAIL
          pass: process.env.MARQUETTE_GMAIL_PASS //process.env.COBEEN_GMAIL_PASS 
        }
      });

    const verified = await transporter.verify()

    if (!verified) {
        throw new Error("transporter verification failed");
    }

    const mailOptions = {
        from: SERVICE_EMAIL, //COBEEN_EMAIL,
        to: pkg.Email,
        subject: "Package Available for Pickup",
        text: getEmailContent(pkg),
        replyTo: REPLY_TO_EMAIL, //DOMINIC_EMAIL,
        dsn: {
            id: '53201',
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: REPLY_TO_EMAIL, //DOMINIC_EMAIL
        }
    }

    const res = await transporter.sendMail(mailOptions) 
    if (res.rejected.length > 0) {
        throw new Error("transporter sendMail failed");
    }
}

export default sendEmail