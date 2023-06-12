import sendEmailWithContent from "./sendEmailWithContent"

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
const BELLA_EMAIL = "Isabella.Buelow@marquette.edu"
const COBEEN_EMAIL = "cobeenmail@gmail.com"
const MARQUETTE_EMAIL = "marquettemailer@gmail.com"

const getEmailContent = (name: string): string => {
    return (
    `Hello Facilities Manager,

This email is to notify you that a package with a name not in the system was delivered, as per reported by the desk workers. The name on the package is ${name}.`)
}

const reportMissingName = async (name: string): Promise<boolean> => {
    try {
        await sendEmailWithContent(
            BELLA_EMAIL, //DOMINIC_EMAIL,
            getEmailContent(name),
            BELLA_EMAIL, //DOMINIC_EMAIL,
            MARQUETTE_EMAIL, //COBEEN_EMAIL,
            process.env.MARQUETTE_GMAIL_PASS, // process.env.COBEEN_GMAIL_PASS,
            "Alert - Package with Out-of-System Name Delivered"
        )
        return true
    } catch (err) {
        console.log("Error in reportMissingName", err)
        return false
    }
}

export { reportMissingName }