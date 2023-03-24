import { Button, CircularProgress, IconButton, Input, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// import { ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ObjectId } from "mongodb";
import { Package } from "@/lib/types";
import Refresh from "@mui/icons-material/Refresh";

type DashboardPackage = {
    packageId: number,
    name: string,
    email: string,
    studentId: string,
    provider: string,
    ingestedTime: string
}

// TODO: use this one as the template

const objectIdToDate = (_id: ObjectId) => {
    const timestamp = _id.toString().substring(0,8)
    const date = new Date( parseInt( timestamp, 16 ) * 1000 )
    return date.toLocaleString()
}

const PackagesTable = () => {
    const [currentPackages, setCurrentPackages] = useState<DashboardPackage[]>([])
    const [expandPackages, setExpandPackages] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getPackages()
    }, [])
    
    const getPackages = async () => {
        setLoading(true)
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
        })
        setCurrentPackages(dashboardPackages)
        setLoading(false)
    }
    return (
        <>
        <div className="flex flex-col max-w-fit items-start justify-start text-left mx-2 px-2 transition ease-out duration-500">
            <div className="flex flex-row justify-between min-w-full">
                <div className="flex flex-row">
                <Typography variant="subtitle1">Packages Pending Pickup:</Typography>
                <IconButton onClick={getPackages} className="-mt-1">
                    <Refresh />
                </IconButton>
                </div>
                <IconButton onClick={() => setExpandPackages(!expandPackages)}>
                    {expandPackages ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>
            <div className={`table-fixed w-full ${!expandPackages && "max-h-[45vh] overflow-scroll"}`}>
            <table className={`table-fixed w-full`}>
                <thead>
                    <tr className="bg-gray-200">
                    <th className="w-1/5 p-2">Name</th>
                    <th className="w-2/5 p-2">Email</th>
                    <th className="w-1/5 p-2">Student ID</th>
                    <th className="w-1/5 p-2">Provider</th>
                    <th className="w-1/5 p-2">Ingested Time</th>
                    <th className="w-1/5 p-2">Package ID</th>
                    </tr>
                </thead>
                {!loading ? <tbody>
                    {currentPackages.map((pkg, i) => (
                    <tr key={i} className="bg-stone-300 outline outline-1">
                        <td className="p-2">{pkg.name}</td>
                        <td className="p-2 break-all">{pkg.email}</td>
                        <td className="p-2">{pkg.studentId}</td>
                        <td className="p-2">{pkg.provider}</td>
                        <td className="p-2">{pkg.ingestedTime}</td>
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

export default PackagesTable