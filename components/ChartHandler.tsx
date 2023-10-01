import { Granularity, Hall, HallStats } from "@/lib/types"

import React from "react"
import { useState } from "react"

type Props = {
    data: HallStats[],
    halls: Hall[]
    children: React.ReactNode
}

const firstCharToCaps = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const ChartHandler = (props: Props) => {
    const [data, halls] = props.data
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
            <h2>Packages by {firstCharToCaps(granularity)}</h2>
            {React.Children.map(props.children, (child) => {
                return React.cloneElement(child as React.ReactElement, { data, halls, granularity })
            })}
        </div>
    )
}

export default ChartHandler