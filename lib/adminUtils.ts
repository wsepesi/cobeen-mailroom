import { DashboardPackage, Hall, HallStats, Package } from "./types"

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

export { colorMap, combineData, resetPass, compareDateStrings, getPackages, getLoggedPackages, getAllPackages, getAllLoggedPackages }