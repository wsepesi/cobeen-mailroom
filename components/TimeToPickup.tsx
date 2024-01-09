import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Granularity, Hall, HallLogged, HallStats } from "@/lib/types"
import { avgTimeToPickup, colorMap, firstCharToCaps } from "@/lib/adminUtils"

import { useState } from "react"

type Props = {
    data: HallStats[],
    loggedData: HallLogged[],
    halls: Hall[]
}

const TimeToPickup = (props: Props): React.ReactElement => {
    const { data, loggedData, halls } = props
    const [granularity, setGranularity] = useState<Granularity>("week")
    return(
        <div className="flex flex-col justify-center items-center">
            <h2>Average Time to Pickup in Hours by {firstCharToCaps(granularity)}</h2>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                width={500}
                height={300}
                data={avgTimeToPickup(loggedData, granularity)}
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
                        type={key === 0 ? "monotone" : "natural"}
                        connectNulls
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