import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DayData, Granularity, Hall, HallStats, Month, MonthData, WeekData } from "@/lib/types"
import { colorMap, combineData, dataByGranularity } from "@/lib/adminUtils"

import { useState } from "react"

type Props = {
    data: HallStats[],
    halls: Hall[]
}

const totalHandler = <T extends MonthData | WeekData | DayData>(
    data: T[], 
    datum: T | undefined, 
    name: Month | string,
    hall: Hall
) => {
    if (datum === undefined) {
        data.push({
            name: name,
            [hall]: 1
        } as T)
    } else {
        datum[hall] = datum[hall] === undefined ? 1 : datum[hall]! + 1
    }
}

const BarCharts = (props: Props) => {
    const data = props.data
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
            {granularity === "month" && <>
            <h2>Packages by Month</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataByGranularity(data, "month", totalHandler)}>
                    <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    {props.halls.map((hall, key) => {
                        return <Bar 
                            dataKey={hall} 
                            key={key} 
                            fill={colorMap(hall)} 
                            radius={[4, 4, 0, 0]} 
                            stackId="stack"
                        />
                    })}
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
            </>}

            {granularity === "week" && <>
            <h2>Packages by Week</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataByGranularity(data, "week", totalHandler)}>
                    <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    {props.halls.map((hall, key) => {
                        return <Bar 
                            dataKey={hall} 
                            key={key} 
                            fill={colorMap(hall)} 
                            radius={[4, 4, 0, 0]} 
                            stackId="stack"
                        />
                    })}
                    <Legend />
                </BarChart>
            </ResponsiveContainer></>}

            {granularity === "day" && <>
            <h2>Packages by Day</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataByGranularity(data, "day", totalHandler)}>
                    <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    {props.halls.map((hall, key) => {
                        return <Bar 
                            dataKey={hall} 
                            key={key} 
                            fill={colorMap(hall)} 
                            radius={[4, 4, 0, 0]} 
                            stackId="stack"
                        />
                    })}
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
            </>}
        </div>
    )
}

export default BarCharts