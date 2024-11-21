import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { DashboardLogged, DashboardPackage, Hall, HallLogged, HallStats } from "@/lib/types"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { combineData, getAllLoggedPackages, getAllPackages } from "@/lib/adminUtils"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import ByDistributor from "@/components/ByDistributor"
import { DataTable } from "@/components/ui/data-table"
import { Download } from "lucide-react"
import PackagesByStudentBarChart from "@/components/PackagesByStudentBarChart"
import { Skeleton } from "@/components/ui/skeleton"
import Total from "@/components/Total"
import { TypographyH1 } from "@/components/ui/h1"
import { TypographyH2 } from "@/components/ui/h2"
import { TypographyP } from "@/components/ui/p"
import { YamHover } from "@/components/YamHover"
import { columns } from "@/components/columns"

const lower = (s: string): Hall => {
    switch (s) {
        case "Cobeen":
            return "cobeen"
        case "Mashuda":
            return "mashuda"
        case "Carpenter":
            return "carpenter"
        default:
            throw new Error("Invalid hall")
    }
}

const YEAR = "2024"
const startDate = new Date(`${YEAR}-08-01`)
const endDate = new Date(`${YEAR}-12-31`)

const restrictCombinedData = (data: HallStats[]): HallStats[] => {
    
    return data.map((d) => {
        return {
            hall: d.hall,
            packages: d.packages.filter((pkg) => {
                const date = new Date(pkg.ingestedTime)
                if (pkg.hasOwnProperty("retrievedTime")) {
                    const newpkg = pkg as DashboardLogged
                    const retrievedDate = new Date(newpkg.retrievedTime)
                    return date >= startDate && date <= endDate && retrievedDate >= startDate && retrievedDate <= endDate
                } else {
                    return date >= startDate && date <= endDate
                }
            })
        }
    })
}

const restrictToInterval = (data: DashboardLogged[], interval: string): DashboardLogged[] => {
    return data.filter((d) => {
        const date = new Date(d.ingestedTime)
        return date >= startDate && date <= endDate
    })
}

type ProviderData = {
    provider: string,
}

const filterDataToProviderOnly = (data: DashboardLogged[]): ProviderData[] => {
    const providers = new Map<string, number>()
    data.forEach((d) => {
        if (providers.has(d.provider)) {
            providers.set(d.provider, providers.get(d.provider)! + 1)
        } else {
            providers.set(d.provider, 1)
        }
    })
    const providerArray: ProviderData[] = []
    providers.forEach((value, key) => {
        providerArray.push({
            provider: key
        })
    })
    return providerArray
}

const HALL = "Cobeen"

const cardCn = "h-[78vh] overflow-auto"
const INTERVAL = `Fall ${YEAR}`

const getNumStudents = (data: DashboardLogged[]): number => {
    const students = new Set<string>()
    data.forEach((d) => {
        students.add(d.studentId)
    })
    return students.size
}

const getNumDailyAvgPkgs = (data: DashboardLogged[]): number => {
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    return data.length / days
}

const getMedianTimeToPickup = (data: DashboardLogged[]): number => {
    const times = data.map((d) => {
        const ingested = new Date(d.ingestedTime)
        const retrieved = new Date(d.retrievedTime)
        const diff = retrieved.getTime() - ingested.getTime()
        // calculate in hours
        return diff / (1000 * 3600)
    })
    times.sort((a, b) => a - b)
    const medianIndex = Math.floor(times.length / 2)
    return times[medianIndex]
}

export default function Report() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<HallStats[] | null>(null)
    const [loggedData, setLoggedData] = useState<HallLogged[] | null>(null)

    const loggedAndRestricted = restrictToInterval(loggedData?.map((d) => d.packages).flat() ?? [], INTERVAL)
    
    useEffect(() => {
        setIsLoading(true)
        getAllPackages([lower(HALL)]).then((data) => {
            setData(data)
        })
        getAllLoggedPackages([lower(HALL)]).then((data) => {
            setLoggedData(data)
        })
        setIsLoading(false)
    }, [])

    const downloadData = () => {
        const tempcsv = loggedData!.map((d) => d.packages).flat().filter((d) => new Date(d.ingestedTime) >= new Date("2023-08-01") && new Date(d.ingestedTime) <= new Date("2023-12-31")).map((d) => {
            return `${d.name},${d.email},${d.studentId},${d.provider},${d.ingestedTime},${new Date(d.retrievedTime).toISOString()}`
        }).join("\n")
        const csv = "Name,Email,Student ID,Provider,Ingested Time,Retrieved Time\n" + tempcsv
        const element = document.createElement("a")
        const file = new Blob([csv], {type: "text/csv"})
        element.href = URL.createObjectURL(file)
        element.download = "data.csv"
        document.body.appendChild(element)
        element.click()
    }

    return (
        <div className="flex flex-col justify-start items-center w-full h-full min-h-[100vh]">
            <TypographyH1 className="mt-5 mb-1 font-sans text-3xl">{HALL} Hall Report -- {INTERVAL}</TypographyH1>
            <div className="flex flex-row items-center justify-center">
                <TypographyH2 className="font-mono mb-3 text-sm">Exported from</TypographyH2>
                <YamHover />
                </div>
            {isLoading || data === null || loggedData === null ? 
                <Skeleton className="w-full" /> :
                <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
                    <Tabs defaultValue="stats" className="w-full px-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="stats">At a Glance</TabsTrigger>
                            <TabsTrigger value="data">Data</TabsTrigger>
                        </TabsList>
                        <TabsContent value="stats">
                            <Card className={cardCn}>
                            <CardHeader className="mb-0 pb-2">
                                <CardTitle className="text-xl">Package Statistics</CardTitle>
                                <CardDescription>
                                Figures generated from package data in {INTERVAL}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="my-3">
                                <div>
                                    <div className="flex flex-row items-center justify-start">
                                        <TypographyP className="mr-2">
                                            A total of <strong>{loggedAndRestricted.length.toString()}</strong> packages were delivered to <strong>{getNumStudents(loggedAndRestricted).toString()}</strong> students.
                                            On average, <strong>{getNumDailyAvgPkgs(loggedAndRestricted).toFixed(0)}</strong> packages were picked up per day. 
                                            The median time to pickup for a package was <strong>{getMedianTimeToPickup(loggedAndRestricted).toFixed(1)}</strong> hours.
                                        </TypographyP>
                                    </div>
                                    {/* <div>
                                    <ResponsiveContainer width={350} height={350}>
                                        <PieChart width={350} height={350}>
                                            <Pie
                                                data={loggedData.map((d) => d.packages).flat()}
                                                dataKey={"total"}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                label={({ name }) => `${name}`}
                                            >
                                                {loggedData.map((d, index) => {
                                                    // make pie chart by provider
                                                    return <Cell key={index} fill="#ffa600" />
                                                })}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    </div> */}
                                </div>
                                <Total
                                    data={restrictCombinedData(combineData(data, loggedData))}
                                    halls={[lower(HALL)]}
                                />
                                <PackagesByStudentBarChart
                                    data={loggedAndRestricted}
                                />  
                            </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="data">
                            <Card className={cardCn}>
                            <CardHeader className="flex flex-row justify-between w-full items-center py-0 my-2">
                                <CardTitle>Package Data</CardTitle>
                                <Button variant="outline" className="" onClick={downloadData}><Download className="h-4 w-4" /></Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <DataTable 
                                    data={loggedAndRestricted}
                                    columns={columns}
                                />
                            </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            }   
        </div>
    )
}
