import { Hall, HallStats } from "@/lib/types"
import { ReactElement, useState } from "react"

import { CircularProgress } from "@mui/material"

type Props = {
    data: HallStats[],
    loggedData: HallStats[],
    halls: Hall[],
    yearly: boolean
}

const AUGUST = 7

const cutoffDate = new Date("2023-08-01")

/**
 * Listed numerical statistics about the packages in the system. Contains the following:
 * - Total number of packages
 * - Number of packages per dorm
 */
const Statistics = (props: Props): ReactElement => {
    const { data, loggedData, halls, yearly } = props
    const [isLoading, setIsLoading] = useState(false)

    const getNumPackages = (hall: Hall, yearly: boolean): number => {
        if (data === null) {
            return 0
        }
        const hallData = data.find((d) => d.hall === hall)
        if (hallData === undefined) {
            return 0
        }
        if (yearly) {
            return hallData.packages.reduce((acc, curr) => {
                const today = new Date(curr.ingestedTime)
                if (today > cutoffDate) {
                    return acc + 1
                }
                return acc
            }, 0)
        }
        return hallData.packages.length
    }

    const getTotalPackages = (yearly: boolean = false): number => {
        if (data === null) {
            return 0
        }
        if (yearly) {
            return data.reduce((acc, curr) => {
                // check pkg.ingestedTime to make sure it is after august 2023
                const today = new Date(curr.packages[0].ingestedTime)
                if (today > cutoffDate) {
                    return acc + curr.packages.length
                }
                return acc
            }, 0)
        }
        return data.reduce((acc, curr) => {
            return acc + curr.packages.length
        }, 0)
    }

    const getNumLoggedPackages = (hall: Hall, yearly: boolean): number => {
        if (loggedData === null) {
            return 0
        }
        const hallData = loggedData.find((d) => d.hall === hall)
        if (hallData === undefined) {
            return 0
        }
        if (yearly) {
            return hallData.packages.reduce((acc, curr) => {
                const year = new Date(curr.ingestedTime).getFullYear()
                const month = new Date(curr.ingestedTime).getMonth()
                if (year >= 2023 && month >= AUGUST) {
                    return acc + 1
                }
                return acc
            }, 0)
        }
        return hallData.packages.length
    }

    const getTotalLoggedPackages = (yearly: boolean): number => {
        if (loggedData === null) {
            return 0
        }
        if (yearly) {
            return loggedData.reduce((acc, curr) => {
                return acc + curr.packages.reduce((acc, curr) => {
                    const year = new Date(curr.ingestedTime).getFullYear()
                    const month = new Date(curr.ingestedTime).getMonth()
                    if (year >= 2023 && month >= AUGUST) {
                        return acc + 1
                    }
                    return acc
                }, 0)
            }, 0)
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
                <p>Statistics {yearly ? `(yearly)` : `(All Time)`}</p>
                <div className="flex flex-row justify-center items-center space-x-5">
                    {!yearly && (
                        <div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Total Packages</p>
                        <p>{getTotalPackages(yearly)}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Packages per Dorm</p>
                        { halls.map((hall, key) => (
                            <div className="flex flex-row justify-between items-center mx-2" key={key}>
                                <p className="mx-3">{hall}</p>
                                <p>{getNumPackages(hall, yearly)}</p>
                            </div>
                        ))}
                    </div>
                    </div>)}
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Total Logged Packages</p>
                        <p>{getTotalLoggedPackages(yearly)}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p>Logged Packages per Dorm</p>
                        { halls.map((hall, key) => (
                            <div className="flex flex-row justify-between items-center mx-2" key={key}>
                                <p className="mx-3">{hall}</p>
                                <p>{getNumLoggedPackages(hall, yearly)}</p>
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