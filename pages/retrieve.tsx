import AutocompleteWithDb, { AcProps } from "@/components/AutocompleteWithDb";

import GoBack from "@/components/GoBack";
import { LogPackage } from "./api/log-package";
import { ObjectId } from "mongodb";
import { Package } from "./api/add-package";

const removeAndLogPackage = async (obj: Package | null) => {
    if (obj === null) {
        alert("No package selected")
        throw new Error('No package selected')
    }
    try {
        console.log('obj', obj)
        const _id: ObjectId = obj._id
        // remove package from db
        const res: Response = await fetch('/api/remove-package', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_id)
        })

        const success: boolean = await res.json()

        if (!success) {
            console.log('failed to remove package')
            throw new Error('Package not removed')
        }

        // log package to logs db
        const log_res = await fetch('/api/log-package', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })

        const log_package: LogPackage = await log_res.json()

        alert(`Package retrieved for ${log_package.Last}, ${log_package.First} with ID (${log_package.packageId})`)
    } catch (error) {
        alert("An error has occured. Please speak to the facilities manager")
    }

}

export default function Retrieve() {

    const props: AcProps = {
        apiRoute: 'get-packages',
        submit: removeAndLogPackage,
        acLabel: 'Package',
        buttonLabel: 'Mark package retrieved',
        displayOption: (mailPackage: Package) => `#${mailPackage.packageId} : ${mailPackage.Last}, ${mailPackage.First}`
    }

    return(
        <>
            <h1>Retrieve packages</h1>
            <div>
                <h3>Search for a package ID or student name:</h3>
                <AutocompleteWithDb {
                    ...props
                }
                />
                <GoBack />
            </div>
        </>
    )
}