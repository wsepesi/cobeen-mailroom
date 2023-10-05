import { BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Hall, HallStats } from "@/lib/types";

import { colorMap } from "@/lib/adminUtils";

type Props = {
    data: HallStats[],
    halls: Hall[]
}

type Distributor = {
    name: string,
    total: number
}

const getHallMapping = (data: HallStats[], halls: Hall[]): Map<Hall, Distributor[]> => {
    const mapping = new Map<Hall, Distributor[]>()
    const cutOffDate = new Date(2023, 7, 1)
    data.forEach((hall) => {
        const hallName = hall.hall
        const hallData = hall.packages
        const distributors = new Map<string, number>()
        hallData.forEach((pkg) => {
            if (new Date(pkg.ingestedTime) < cutOffDate) return
            const distributor = pkg.provider
            if (distributors.has(distributor)) {
                distributors.set(distributor, distributors.get(distributor)! + 1)
            } else {
                distributors.set(distributor, 1)
            }
        })
        const distributorArray: Distributor[] = []
        distributors.forEach((value, key) => {
            distributorArray.push({
                name: key,
                total: value
            })
        })
        mapping.set(hallName, distributorArray)
    })

    return mapping
}

const data01 = [
    {
      "name": "Group A",
      "value": 400
    },
    {
      "name": "Group B",
      "value": 300
    },
    {
      "name": "Group C",
      "value": 300
    },
    {
      "name": "Group D",
      "value": 200
    },
    {
      "name": "Group E",
      "value": 278
    },
    {
      "name": "Group F",
      "value": 189
    }
  ];

// create piechart of packages by distributor
const ByDistributor = (props: Props) => {
    const { data, halls } = props
    const mapping = getHallMapping(data, halls)
    console.log(mapping)
    return(
        <div className="flex flex-row justify-center items-center">
            <h2>Packages by Distributor</h2>
                    {halls.map((hall, index) => {
                        return <>
                        <h2>{hall}</h2>
                        <ResponsiveContainer width={350} height={350}>
                        <PieChart width={350} height={350}>
                            <Pie
                                data={mapping.get(hall)}
                                dataKey={"total"}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name }) => `${name}`}
                            >
                                {mapping.get(hall)!.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colorMap(hall)} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        </ResponsiveContainer>
                        </>
                    })}
        </div>
    )
}

export default ByDistributor;