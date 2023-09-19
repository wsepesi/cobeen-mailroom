import { Package } from "@/lib/types"
import { getCollectionAsync } from "@/lib/getCollection"
import sendEmail from "@/lib/sendEmail"

const exponentialBackoff = (maybeFailingFunction: () => Promise<any>, maxRetries: number, delay: number) => {
    return new Promise((resolve, reject) => {
        const tryOnce = async (retriesLeft: number) => {
            try {
                const result = await maybeFailingFunction()
                resolve(result)
            } catch (e) {
                if (retriesLeft > 0) {
                    setTimeout(() => tryOnce(retriesLeft - 1), delay)
                } else {
                    reject(e)
                }
            }
        }
        tryOnce(maxRetries)
    })
}

const failedEmailContent = (pkg: Package): string => {
    return (
    `Hello ${pkg.First},

    This email is to notify you that you have a package delivered by ${pkg.provider} to pick up in the mailroom in the first floor lobby. Please let the front desk know if you have any questions!

    Best,
    Desk Staff`)
}

const resendFailedEmails = async () => {
    const collection = await getCollectionAsync('failed_packages')
    const failed_packages = await collection.find().toArray() as Package[]
    console.log(failed_packages)

    // send emails
    for (const failed_package of failed_packages) {
        console.log(failed_package)
        const res = await exponentialBackoff(() => sendEmail(failed_package, failedEmailContent), 5, 1000)
        if (res) {
            console.log(res)
            await collection.deleteOne({ _id: failed_package._id })
        } else {
            console.log(`failed to send email for package ${failed_package.packageId}`)
        }
        // wait 1 second between emails
        await new Promise(r => setTimeout(r, 1000))
    }
}

resendFailedEmails()