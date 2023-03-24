import { ObjectId } from "mongodb"
import { Package } from "@/lib/types"
import TableBase from "./TableBase"

const objectIdToDate = (_id: ObjectId) => {
    const timestamp = _id.toString().substring(0,8)
    const date = new Date( parseInt( timestamp, 16 ) * 1000 )
    return date.toLocaleString()
}

type DashboardPackage = {
    packageId: number,
    name: string,
    email: string,
    studentId: string,
    provider: string,
    ingestedTime: string
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
        <th className="w-1/5 p-2">Package ID</th>
    </>



const PackagesTable = () => {
    const getPackages = async () => {
        const res = await fetch('/api/get-packages')
        const packages: Package[] = (await res.json()).records
        const dashboardPackages: DashboardPackage[] = packages.map((p) => {
            return {
                packageId: p.packageId,
                name: `${p.First} ${p.Last}`,
                email: p.Email,
                studentId: p.studentId,
                provider: p.provider,
                ingestedTime: objectIdToDate(p._id)
            }
        }).sort((a, b) => {
            if (a.ingestedTime < b.ingestedTime) {
                return 1
            } else if (a.ingestedTime > b.ingestedTime) {
                return -1
            } else {
                return 0
            }
        })

        return dashboardPackages
    }

    return (
        <>
            <TableBase
                fetcher={getPackages}
                columns={columns}
                dataToRow={(pkg: DashboardPackage) =>
                    <>
                        <td className="p-2">{pkg.name}</td>
                        <td className="p-2 break-all">{pkg.email}</td>
                        <td className="p-2">{pkg.studentId}</td>
                        <td className="p-2">{pkg.provider}</td>
                        <td className="p-2">{pkg.ingestedTime}</td>
                        <td className="p-2">{pkg.packageId}</td>
                    </>
                }
            />
        </>
    )
}

export default PackagesTable