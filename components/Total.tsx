import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DayData, Granularity, Hall, HallStats, Month, MonthData, WeekData } from "@/lib/types"
import { colorMap, dataByGranularity, firstCharToCaps } from "@/lib/adminUtils"

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

const Total = (props: Props) => {
    const data = props.data
    const [granularity, setGranularity] = useState<Granularity>("week")
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
            <h2>Packages Ingested by {firstCharToCaps(granularity)}</h2>
            {granularity === "day" ? 
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataByGranularity(data, granularity, totalHandler, true)}>
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
                :
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart 
                    data={dataByGranularity(data, granularity, totalHandler, true)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        {props.halls.map((hall, key) => {
                            return <linearGradient id={`color${hall}`} x1="0" y1="0" x2="0" y2="1" key={key}>
                                <stop offset="5%" stopColor={colorMap(hall)} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={colorMap(hall)} stopOpacity={0}/>
                            </linearGradient>
                        })}
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {props.halls.map((hall, key) => {
                        return <Area
                            type="monotone"
                            connectNulls
                            dataKey={hall}
                            key={key}
                            stroke={colorMap(hall)}
                            fillOpacity={1}
                            fill={`url("#color${hall}")`}
                            />
                    })}
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        }  
        <h2>Packages Retrieved by {firstCharToCaps(granularity)}</h2>
            {granularity === "day" ? 
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dataByGranularity(data, granularity, totalHandler, false)}>
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
                :
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart 
                    data={dataByGranularity(data, granularity, totalHandler, false)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        {props.halls.map((hall, key) => {
                            return <linearGradient id={`color${hall}`} x1="0" y1="0" x2="0" y2="1" key={key}>
                                <stop offset="5%" stopColor={colorMap(hall)} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={colorMap(hall)} stopOpacity={0}/>
                            </linearGradient>
                        })}
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {props.halls.map((hall, key) => {
                        return <Area
                            type="monotone"
                            connectNulls
                            dataKey={hall}
                            key={key}
                            stroke={colorMap(hall)}
                            fillOpacity={1}
                            fill={`url("#color${hall}")`}
                            />
                    })}
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        }  
        </div>
    )
}

export default Total