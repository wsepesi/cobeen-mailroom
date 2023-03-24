import { Button, CircularProgress, IconButton, Input, Skeleton, Typography } from "@mui/material";
import { LogPackage, Package } from "@/lib/types";
import { useEffect, useState } from "react";

// import { ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ObjectId } from "mongodb";
import Refresh from "@mui/icons-material/Refresh";

type DashboardLogged = {
    packageId: number,
    name: string,
    email: string,
    studentId: string,
    provider: string,
    ingestedTime: string,
    retrievedTime: string
}

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

const LoggedTable = () => {
    const [loggedPackages, setLoggedPackages] = useState<DashboardLogged[]>([])
    const [expandPackages, setExpandPackages] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getPackages()
    }, [])
    
    const getPackages = async () => {
        setLoading(true)
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
        })
        setLoggedPackages(logged)
        setLoading(false)
    }
    return (
        <>
        <div className="flex flex-col max-w-fit max-h-[50vh] items-start justify-start text-left mx-2 px-2 transition ease-out duration-500">
            <div className="flex flex-row justify-between min-w-full">
                <div className="flex flex-row">
                <Typography variant="subtitle1">Logged Retrieved Packages:</Typography>
                <IconButton onClick={getPackages} className="-mt-1">
                    <Refresh />
                </IconButton>
                </div>
                <IconButton onClick={() => setExpandPackages(!expandPackages)}>
                    {expandPackages ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>
            <div className={`table-fixed w-full max-h-[45vh] ${!expandPackages && "overflow-scroll"}`}>
            <table className={`table-fixed w-full`}>
                <thead>
                    <tr className="bg-gray-200">
                    <th className="w-1/5 p-2">Name</th>
                    <th className="w-2/5 p-2">Email</th>
                    <th className="w-1/5 p-2">Student ID</th>
                    <th className="w-1/5 p-2">Provider</th>
                    <th className="w-1/5 p-2">Ingested Time</th>
                    <th className="w-1/5 p-2">Retrieved Time</th>
                    <th className="w-1/5 p-2">Package ID</th>
                    </tr>
                </thead>
                {!loading ? 
                    <tbody>
                        {loggedPackages.map((pkg, i) => (
                        <tr key={i} className="bg-stone-300 outline outline-1">
                            <td className="p-2">{pkg.name}</td>
                            <td className="p-2">{pkg.email}</td>
                            <td className="p-2">{pkg.studentId}</td>
                            <td className="p-2">{pkg.provider}</td>
                            <td className="p-2">{pkg.ingestedTime}</td>
                            <td className="p-2">{pkg.retrievedTime}</td>
                            <td className="p-2">{pkg.packageId}</td>
                        </tr>
                        ))}
                    </tbody>
                    :
                    <Skeleton variant="rectangular" width="80vw" height="45vh" animation="wave" />
                }
            </table>
            </div>
        </div>
        {/* {!expandPackages && <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-gradient-to-t from-gray-400 to-transparent"></div>} */}
        </>
    )
}

export default LoggedTable