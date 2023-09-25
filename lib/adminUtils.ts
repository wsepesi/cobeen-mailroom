import { DashboardPackage, DayData, Granularity, Hall, HallStats, Month, MonthData, Package, WeekData } from "./types"

import { ObjectId } from "mongodb"

export const objectIdToDate = (_id: ObjectId) => {
    const timestamp = _id.toString().substring(0,8)
    const date = new Date( parseInt( timestamp, 16 ) * 1000 )
    return date.toLocaleString()
}

const resetPass = async (passVal: string, setPassOpen: (arg0: boolean) => void, key: string, setPass: ((arg0: string) => void), setIsLoading: ((arg0: boolean) => void)) => {
    if (passVal === '') {
        alert('Please enter a new password')
    } else {
        setIsLoading(true)
        const res = await fetch('/api/reset-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key,
                password: passVal
            })
        })
        setIsLoading(false)
        setPassOpen(false)
        setPass('')
        if (res.status === 200) {
            alert('Password reset successfully')
        } else {
            console.log(await res.json())
            alert('Something went wrong')
        }
    }
}

const compareDateStrings = (a: string, b: string) => {
    const aDate = new Date(a)
    const bDate = new Date(b)
    if (aDate < bDate) {
        return 1
    } else if (aDate > bDate) {
        return -1
    } else {
        return 0
    }
}

const getPackages = async (hall: string): Promise<DashboardPackage[]> => {
    const res = await fetch('/api/get-packages-from?' + new URLSearchParams({ hall: hall }))
    const packages: Package[] = (await res.json()).records
    const dashboardPackages: DashboardPackage[] = packages.map((p) => {
        return {
            packageId: p.packageId,
            name: `${p.First} ${p.Last}`,
            email: p.Email,
            studentId: p.studentId,
            provider: p.provider,
            ingestedTime: objectIdToDate(p._id)
        }
    }).sort((a, b) => {
        return compareDateStrings(a.ingestedTime, b.ingestedTime)
    })

    return dashboardPackages
}

const getLoggedPackages = async (hall: string): Promise<DashboardPackage[]> => {
    const res = await fetch('/api/get-logged-packages-from?' + new URLSearchParams({ hall: hall }))
    const packages: Package[] = (await res.json()).records
    const dashboardPackages: DashboardPackage[] = packages.map((p) => {
        return {
            packageId: p.packageId,
            name: `${p.First} ${p.Last}`,
            email: p.Email,
            studentId: p.studentId,
            provider: p.provider,
            ingestedTime: objectIdToDate(p._id)
        }
    }).sort((a, b) => {
        return compareDateStrings(a.ingestedTime, b.ingestedTime)
    })

    return dashboardPackages
}

const getAllPackages = async (halls: Hall[]): Promise<HallStats[]> => {
    const data = await Promise.all(halls.map(async (hall) => {
        const packages = await getPackages(hall)
        return {
            hall: hall,
            packages: packages
        }
    }))
    return data
}

const getAllLoggedPackages = async (halls: Hall[]): Promise<HallStats[]> => {
    const data = await Promise.all(halls.map(async (hall) => {
        const packages = await getLoggedPackages(hall)
        return {
            hall: hall,
            packages: packages
        }
    }))
    return data
}

const combineData = (data: HallStats[], loggedData: HallStats[]) => {
    const combinedData: HallStats[] = data.map((d) => {
        const loggedHall = loggedData.find((ld) => ld.hall === d.hall)
        const combinedPackages = d.packages.concat(loggedHall?.packages || [])
        return {
            hall: d.hall,
            packages: combinedPackages
        }
    })
    return combinedData
}

const colorMap = (hall: Hall): string => {
    // map each hall to a complementary color
    switch (hall) {
        case "cobeen":
            return "#ffa600"
        case "mashuda":
            return "#ffa05e"
        case "carpenter":
            return "#ffa690"
        default:
            return "#FFFFFF"
    }
}

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

const isOlderThan = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() < date2.getFullYear() || 
        (date1.getFullYear() === date2.getFullYear() && date1.getMonth() < date2.getMonth()) ||
        (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() < date2.getDate())
}
// date for 08/01/2023
const beforeDate = new Date(2023, 7, 1)


const dataByT = <T extends MonthData | DayData | WeekData>(
    data: HallStats[], 
    filterFunc: (date: Date, data: T[]) => [string, T],
    sortFunc: (data: T[]) => T[],
    handlerFunc: (data: T[], datum: T, name: Month | string, hall: Hall) => void
): T[] => {
    const TData: T[] = []
    data.forEach((hall) => {
        hall.packages.forEach((pkg) => {
            const date: Date = new Date(pkg.ingestedTime)

            if (isOlderThan(date, beforeDate)) {
                return
            }

            const [ name, datum ] = filterFunc(date, TData)
            handlerFunc(TData, datum, name, hall.hall)
        })
    })

    return sortFunc(TData)
}

const dataByMonths = (
    data: HallStats[], 
    handlerFunc: (data: MonthData[], datum: MonthData, name: Month | string, hall: Hall) => void
): MonthData[] => {
    const filterFunc = (date: Date, data: MonthData[]): [Month, MonthData] => {
        const month: Month = months[date.getMonth()]
        const datum = data.find((d) => d.name === month)
        return [month, datum!]
    }
    const sortFunc = (data: MonthData[]): MonthData[] => {
        // sort data by month
        data.sort((a, b) => {
            return months.indexOf(a.name) - months.indexOf(b.name)
        })
        return data
    }

    return dataByT(data, filterFunc, sortFunc, handlerFunc)
}

const dataByWeeks = (
    data: HallStats[], 
    handlerFunc: (data: WeekData[], datum: WeekData, name: string, hall: Hall) => void
): WeekData[] => {
    // define convention that a week starts on a monday
    const filterFunc = (date: Date, data: WeekData[]): [string, WeekData] => {
        // each week is defined by the preceeding monday
        const day = date.getDay()
        const monday = new Date(date)
        monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
        const week = `${monday.getMonth() + 1}/${monday.getDate()}`
        const datum = data.find((d) => d.name === week)
        return [week, datum!]
    }
    const sortFunc = (data: WeekData[]): WeekData[] => {
        // sort data by week (first sort by month, then day)
        data.sort((a, b) => {
            const aMonth = parseInt(a.name.split('/')[0])
            const bMonth = parseInt(b.name.split('/')[0])
            if (aMonth !== bMonth) {
                return aMonth - bMonth
            }
            const aDay = parseInt(a.name.split('/')[1])
            const bDay = parseInt(b.name.split('/')[1])
            return aDay - bDay
        })
        return data
    }

    return dataByT(data, filterFunc, sortFunc, handlerFunc)
}

const dataByDays = (
    data: HallStats[], 
    handlerFunc: (data: DayData[], datum: DayData, name: string, hall: Hall) => void
): DayData[] => {
    const filterFunc = (date: Date, data: DayData[]): [string, DayData] => {
        const day = `${date.getMonth() + 1}/${date.getDate()}`
        const datum = data.find((d) => d.name === day)
        return [day, datum!]
    }
    const sortFunc = (data: DayData[]): DayData[] => {
        // sort data by day (first sort by month, then day)
        data.sort((a, b) => {
            const aMonth = parseInt(a.name.split('/')[0])
            const bMonth = parseInt(b.name.split('/')[0])
            if (aMonth !== bMonth) {
                return aMonth - bMonth
            }
            const aDay = parseInt(a.name.split('/')[1])
            const bDay = parseInt(b.name.split('/')[1])
            return aDay - bDay
        })
        return data
    }

    return dataByT(data, filterFunc, sortFunc, handlerFunc)
}

const dataByGranularity = (
    data: HallStats[], 
    granularity: Granularity,
    handlerFunc: (data: MonthData[] | WeekData[] | DayData[], datum: MonthData | WeekData | DayData, name: Month | string, hall: Hall) => void
): MonthData[] | WeekData[] | DayData[] => {
    switch (granularity) {
        case "month":
            return dataByMonths(data, handlerFunc)
        case "week":
            return dataByWeeks(data, handlerFunc)
        case "day":
            return dataByDays(data, handlerFunc)
    }
}

export { dataByGranularity, colorMap, combineData, resetPass, compareDateStrings, getPackages, getLoggedPackages, getAllPackages, getAllLoggedPackages }