import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Hall, HallStats } from "@/lib/types"
import { colorMap, combineData } from "@/lib/adminUtils"

type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | 
    "Sep" | "Oct" | "Nov" | "Dec"

const months: Month[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug", 
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

type Props = {
    data: HallStats[],
    loggedData: HallStats[],
    halls: Hall[]
}

type HallTotal = {
    [K in Hall]?: number
}

type MonthData = HallTotal & {
    name: Month,
}

type WeekData = HallTotal & {
    name: string,
}

const dataByMonths = (data: HallStats[]): MonthData[] => {
    const monthData: MonthData[] = []
    data.forEach((hall) => {
        hall.packages.forEach((pkg) => {
            const date: Date = new Date(pkg.ingestedTime)

            // filter out packages from before 08/2023
            if (date.getFullYear() < 2023 || (date.getFullYear() === 2023 && date.getMonth() < 7)) {
                return
            }

            const month: Month = months[date.getMonth()]
            const monthDatum = monthData.find((d) => d.name === month)
            if (monthDatum === undefined) {
                monthData.push({
                    name: month,
                    [hall.hall]: 1
                })
            } else {
                monthDatum[hall.hall] = monthDatum[hall.hall] === undefined ? 1 : monthDatum[hall.hall]! + 1
            }
        })
    })

    // sort data by month
    monthData.sort((a, b) => {
        return months.indexOf(a.name) - months.indexOf(b.name)
    })
    return monthData
}

const dataByWeeks = (data: HallStats[]): WeekData[] => {
    // define convention that a week starts on a monday
    const weekData: WeekData[] = []
    data.forEach((hall) => {
        hall.packages.forEach((pkg) => {
            const date: Date = new Date(pkg.ingestedTime)

            // filter out packages from before 08/2023
            if (date.getFullYear() < 2023 || (date.getFullYear() === 2023 && date.getMonth() < 7)) {
                return
            }

            // each week is defined by the preceeding monday
            const day = date.getDay()
            const monday = new Date(date)
            monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
            const week = `${monday.getMonth() + 1}/${monday.getDate()}`
            const weekDatum = weekData.find((d) => d.name === week)
            
            if (weekDatum === undefined) {
                weekData.push({
                    name: week,
                    [hall.hall]: 1
                })
            } else {
                weekDatum[hall.hall] = weekDatum[hall.hall] === undefined ? 1 : weekDatum[hall.hall]! + 1
            }
        })
    })

    // sort data by week (first sort by month, then day)
    weekData.sort((a, b) => {
        const aMonth = parseInt(a.name.split('/')[0])
        const bMonth = parseInt(b.name.split('/')[0])
        if (aMonth !== bMonth) {
            return aMonth - bMonth
        }
        const aDay = parseInt(a.name.split('/')[1])
        const bDay = parseInt(b.name.split('/')[1])
        return aDay - bDay
    })
    return weekData
}

const BarCharts = (props: Props) => {
    const data = combineData(props.data, props.loggedData)
    return(
        <div className="flex flex-col justify-center items-center">
            <h2>Packages by Month</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataByMonths(data)}>
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

            <h2>Packages by Week</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataByWeeks(data)}>
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
        </div>
    )
}

export default BarCharts