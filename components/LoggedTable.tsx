import { LogPackage, Package } from "@/lib/types"

import { ObjectId } from "mongodb"
import TableBase from "./TableBase"
import { compareDateStrings } from "@/lib/adminUtils"

const objectIdToDate = (_id: ObjectId) => {
    const timestamp = _id.toString().substring(0,8)
    const date = new Date( parseInt( timestamp, 16 ) * 1000 )
    return date.toLocaleString()
}

const UTCToString = (utc: Date) => {
    // create a new date object with the timestamp, so that we can convert it back to a readable string
    const date = new Date(utc)
    return date.toLocaleString()
}

type DashboardLogged = {
    packageId: number,
    name: string,
    email: string,
    studentId: string,
    provider: string,
    ingestedTime: string,
    retrievedTime: string
}

interface HeaderProps extends React.HTMLAttributes<HTMLTableCellElement> { 
    scope?: "col"
}  

const columns: React.ReactElement<HeaderProps> = 
    <>
        <th className="w-1/5 p-2">Name</th>
        <th className="w-2/5 p-2">Email</th>
        <th className="w-1/5 p-2">Student ID</th>
        <th className="w-1/5 p-2">Provider</th>
        <th className="w-1/5 p-2">Ingested Time</th>
        <th className="w-1/5 p-2">Retrieved Time</th>
        <th className="w-1/5 p-2">Package ID</th>
    </>

const LoggedTable = () => {
    const getPackages = async () => {
        const res = await fetch('/api/get-logged-packages')
        const packages: LogPackage[] = (await res.json()).records
        const logged: DashboardLogged[] = packages.map((p) => {
            return {
                packageId: p.packageId,
                name: `${p.First} ${p.Last}`,
                email: p.Email,
                studentId: p.studentId,
                provider: p.provider,
                retrievedTime: objectIdToDate(p._id),
                ingestedTime: UTCToString(p.ingestedTime)
            }
        }).sort((a, b) => {
            return compareDateStrings(a.ingestedTime, b.ingestedTime)
        })

        return logged
    }

    return (
        <>
            <TableBase
                fetcher={getPackages}
                columns={columns}
                dataToRow={(pkg: DashboardLogged) =>
                    <>
                        <td className="p-2">{pkg.name}</td>
                        <td className="p-2 break-all">{pkg.email}</td>
                        <td className="p-2">{pkg.studentId}</td>
                        <td className="p-2">{pkg.provider}</td>
                        <td className="p-2">{pkg.ingestedTime}</td>
                        <td className="p-2">{pkg.retrievedTime}</td>
                        <td className="p-2">{pkg.packageId}</td>
                    </>
                }
                title="Retrieved Packages"
            />
        </>
    )
}

export default LoggedTable