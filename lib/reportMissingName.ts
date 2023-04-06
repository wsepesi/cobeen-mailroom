import sendEmailWithContent from "./sendEmailWithContent"

const DOMINIC_EMAIL = "Dominic.barry@marquette.edu"
const COBEEN_EMAIL = "cobeenmail@gmail.com"

const getEmailContent = (name: string): string => {
    return (
    `Hello Facilities Manager,

This email is to notify you that a package with a name not in the system was delivered to Cobeen Hall. The name on the package is ${name}.`)
}

const reportMissingName = async (name: string): Promise<boolean> => {
    try {
        await sendEmailWithContent(
            DOMINIC_EMAIL,
            getEmailContent(name),
            DOMINIC_EMAIL,
            COBEEN_EMAIL,
            process.env.COBEEN_GMAIL_PASS,
            "Alert - Package with Out-of-System Name Delivered"
        )
        return true
    } catch (err) {
        console.log("Error in reportMissingName", err)
        return false
    }
}

export { reportMissingName }