import nodemailer from 'nodemailer'

const sendEmailWithContent = async (
    toEmail: string, 
    content: string, 
    adminEmail: string, 
    fromEmail: string, 
    fromPass: string | undefined,
    subject: string
) => {
    if (fromPass === undefined) {
        throw new Error("COBEEN_GMAIL_PASS not set")
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: fromEmail,
          pass: fromPass
        }
      });

    const verified = await transporter.verify()

    if (!verified) {
        throw new Error("transporter verification failed");
    }

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: content,
        replyTo: adminEmail,
        dsn: {
            id: '53201',
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: adminEmail
        }
    }

    const res = await transporter.sendMail(mailOptions) 
    if (res.rejected.length > 0) {
        throw new Error("transporter sendMail failed");
    }
}

export default sendEmailWithContent