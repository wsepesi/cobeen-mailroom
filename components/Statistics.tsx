import { Hall, HallStats } from "@/lib/types"
import { ReactElement, useEffect, useState } from "react"

import { CircularProgress } from "@mui/material"

type Props = {
    data: HallStats[],
    loggedData: HallStats[],
    halls: Hall[]
}

/**
 * Listed numerical statistics about the packages in the system. Contains the following:
 * - Total number of packages
 * - Number of packages per dorm
 */
const Statistics = (props: Props): ReactElement => {
    const { data, loggedData, halls } = props
    const [isLoading, setIsLoading] = useState(false)

    const getNumPackages = (hall: Hall): number => {
        if (data === null) {
            return 0
        }
        const hallData = data.find((d) => d.hall === hall)
        if (hallData === undefined) {
            return 0
        }
        return hallData.packages.length
    }

    const getTotalPackages = (): number => {
        if (data === null) {
            return 0
        }
        return data.reduce((acc, curr) => {
            return acc + curr.packages.length
        }, 0)
    }

    const getNumLoggedPackages = (hall: Hall): number => {
        if (loggedData === null) {
            return 0
        }
        const hallData = loggedData.find((d) => d.hall === hall)
        if (hallData === undefined) {
            return 0
        }
        return hallData.packages.length
    }

    const getTotalLoggedPackages = (): number => {
        if (loggedData === null) {
            return 0
        }
        return loggedData.reduce((acc, curr) => {
            return acc + curr.packages.length
        }, 0)
    }
    
    return(
        <>
        {isLoading || data === null? (
            <div className="flex flex-col justify-center items-center">
                <p>Loading...</p>
                <CircularProgress />
                </div>
        ) : (
            <div className="flex flex-col justify-center items-center">
                <p>Statistics (All Time)</p>
                <div className="flex flex-row justify-center items-center space-x-5">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Total Packages</p>
                        <p>{getTotalPackages()}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Packages per Dorm</p>
                        { halls.map((hall, key) => (
                            <div className="flex flex-row justify-between items-center mx-2" key={key}>
                                <p className="mx-3">{hall}</p>
                                <p>{getNumPackages(hall)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Total Logged Packages</p>
                        <p>{getTotalLoggedPackages()}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Logged Packages per Dorm</p>
                        { halls.map((hall, key) => (
                            <div className="flex flex-row justify-between items-center mx-2" key={key}>
                                <p className="mx-3">{hall}</p>
                                <p>{getNumLoggedPackages(hall)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default Statistics