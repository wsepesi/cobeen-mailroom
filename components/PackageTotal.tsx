import { Card, Text } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
    hall: "cobeen" | "all"
    text: string
    variant: "current" | "retrieved"
}

const getNumPackages = async (hall: string, retrieved: boolean): Promise<number> => {
    const res = await fetch('/api/get-packages', { //TODO: get request with hall number -- should always parse this. unify API across app
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hall,
            retrieved: false
        })
    })
    const data = await res.json()
    return data.records.length
}

export default function PackageTotal(props: Props) {
    const [numPackages, setNumPackages] = useState<number>(0)

    useEffect(() => {
        getNumPackages().then((num) => {
            setNumPackages(num)
        })
    }, [])

    return (
        <>
            <Card className="flex flex-row">
                <Text size="sm">{props.text}</Text>
                <Text size="lg">{numPackages}</Text>
            </Card>
        </>
    )
}