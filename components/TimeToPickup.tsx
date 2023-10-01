import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DayData, Granularity, Hall, HallLogged, HallStats, HallTotal, Month, MonthData, WeekData } from "@/lib/types"
import { colorMap, dataByGranularity, firstCharToCaps, months } from "@/lib/adminUtils"

import { useState } from "react"

type Props = {
    data: HallStats[],
    loggedData: HallLogged[],
    halls: Hall[]
}
type countingData = {
    count: number,
    totalTime: number
}
// define avg time to pickup as of the packages picked up during this time, how many hours did it take to pick it up
const avgTimeToPickup = (data: HallLogged[], granularity: Granularity): MonthData[] | WeekData[] | DayData[] => {
    const granularities: [Hall, Map<string, countingData>][] = []
    data.forEach((datum) => {
        const hall = datum.hall
        const packages = datum.packages

        const cutOffDate = new Date(2023, 7, 1)
        const recentPackages = packages.filter((pkg) => new Date(pkg.ingestedTime) > cutOffDate)

        
        const granularityToDataMap = new Map<string, countingData>()
        // divide into blocks of granularity
        if (granularity === "month") {
            recentPackages.forEach((pkg => {
                const retrievedDate = new Date(pkg.retrievedTime)
                const ingestedDate = new Date(pkg.ingestedTime)

                const month: Month = months[retrievedDate.getMonth()]
                const timeToRetrieval = (retrievedDate.getTime() - ingestedDate.getTime()) / 1000 / 60 / 60

                if (!granularityToDataMap.has(month)) {
                    granularityToDataMap.set(month, {
                        count: 1,
                        totalTime: timeToRetrieval
                    })
                } else {
                    const data = granularityToDataMap.get(month)!
                    data.count++
                    data.totalTime += timeToRetrieval
                }
            }))
        }
        else if (granularity === "week") {
            recentPackages.forEach((pkg => {
                const retrievedDate = new Date(pkg.retrievedTime)
                const ingestedDate = new Date(pkg.ingestedTime)

                // get the week, as by the previous monday's date
                const date = retrievedDate
                const day = date.getDay()
                const monday = new Date(date)
                monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
                const week = `${monday.getMonth() + 1}/${monday.getDate()}`
                // const week: string = new Date(retrievedDate.getTime() - (retrievedDate.getDay() - 1) * 24 * 60 * 60 * 1000).toDateString()
                const timeToRetrieval = (retrievedDate.getTime() - ingestedDate.getTime()) / 1000 / 60 / 60

                if (!granularityToDataMap.has(week)) {
                    granularityToDataMap.set(week, {
                        count: 1,
                        totalTime: timeToRetrieval
                    })
                } else {
                    const data = granularityToDataMap.get(week)!
                    data.count++
                    data.totalTime += timeToRetrieval
                }
            }))} 
            else if (granularity === "day") {
                recentPackages.forEach((pkg => {
                    const retrievedDate = new Date(pkg.retrievedTime)
                    const ingestedDate = new Date(pkg.ingestedTime)

                    const day = `${retrievedDate.getMonth() + 1}/${retrievedDate.getDate()}`
                    const timeToRetrieval = (retrievedDate.getTime() - ingestedDate.getTime()) / 1000 / 60 / 60

                    if (!granularityToDataMap.has(day)) {
                        granularityToDataMap.set(day, {
                            count: 1,
                            totalTime: timeToRetrieval
                        })
                    } else {
                        const data = granularityToDataMap.get(day)!
                        data.count++
                        data.totalTime += timeToRetrieval
                    }
                }))
            } else {
                throw new Error("Invalid granularity")
            }
        granularities.push([hall, granularityToDataMap])
    })
    // process into final form
    const finalData: MonthData[] | WeekData[] | DayData[] = []
    granularities.forEach((pair) => {
        const hall = pair[0]
        const granularityToDataMap = pair[1]
        granularityToDataMap.forEach((data, granularity) => {
            const avgTimeToPickup = data.totalTime / data.count
            const datum = {
                name: granularity,
                [hall]: avgTimeToPickup
            }
            // if finaldata has this granularity, add the hall to the datum
            const index = finalData.findIndex((datum) => datum.name === granularity)
            if (index === -1) {
                finalData.push(datum)
            } else {
                finalData[index][hall] = avgTimeToPickup
            }
        })
    })
    // sort final data by date
    finalData.sort((a, b) => {
        const aDate = new Date(a.name)
        const bDate = new Date(b.name)
        return aDate.getTime() - bDate.getTime()
    }).reverse()
    return finalData
}

const TimeToPickup = (props: Props): React.ReactElement => {
    const { data, loggedData, halls } = props
    const [granularity, setGranularity] = useState<Granularity>("day")
    return(
        <div className="flex flex-col justify-center items-center">
            <select 
                className="my-5"
                value={granularity}
                onChange={(e) => setGranularity(e.target.value as Granularity)}
            >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
            </select>
            <h2>Average Time to Pickup in Hours by {firstCharToCaps(granularity)}</h2>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                width={500}
                height={300}
                data={avgTimeToPickup(loggedData, granularity)}
                // data={testdata}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.halls.map((hall, key) => {
                    return <Line 
                        dataKey={hall} 
                        key={key} 
                        stroke={colorMap(hall)} 
                        activeDot={{ r: 8 }} 
                    />
                })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TimeToPickup