import { DashboardPackage, Hall, HallStats, Package } from "@/lib/types"
import { getAllLoggedPackages, getAllPackages } from "@/lib/adminUtils";
import { useEffect, useState } from "react";

import BarCharts from "@/components/BarChart";
import { CircularProgress } from "@mui/material";
import Head from "next/head";
import Statistics from "@/components/Statistics";

const halls: Hall[] = [
    "cobeen",
    "mashuda",
    "carpenter"
]

/** Desired Features:
 * # total packages, # packages per dorm [DONE]
 * bar chart of packages per month, with a different color for each dorm. can toggle to weekly [DONE]
 * average wait time to pick up package as a line graph over time, per dorm
 * breakdown by residents (figure out best format)
 * pie chart by carrier
 */

export default function Overview() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<HallStats[] | null>(null)
    const [loggedData, setLoggedData] = useState<HallStats[] | null>(null)

    useEffect(() => {
        setIsLoading(true)
        getAllPackages(halls).then((data) => {
            setData(data)
        })
        getAllLoggedPackages(halls).then((data) => {
            setLoggedData(data)
        })
        setIsLoading(false)
    }, [])

    return(
        <>
            <Head>
                <title>Overview</title>
            </Head>
            <div className="flex flex-col min-h-screen min-w-[90vw] ml px-[5vw]">
                {isLoading || data === null || loggedData === null ? (
                    <CircularProgress />
                ) : (
                    <div className="flex flex-col justify-start my-10">
                        <Statistics 
                            data={data}
                            loggedData={loggedData}
                            halls={halls}
                        />
                        <hr className="my-[5vh]"/>
                        <BarCharts 
                            data={data}
                            loggedData={loggedData}
                            halls={halls}
                        />
                    </div>
                )}
            </div>
        </>
    )
}