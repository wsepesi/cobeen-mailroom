import {
    Bar,
    BarChart,
    Brush,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { DashboardPackage } from '@/lib/types';
import React from 'react';
import { TypographyP } from './ui/p';

type Props = {
    data: DashboardPackage[]
}

type PPUData = {
    studentId: string,
    num_packages: number
}

const getPackagesPerUser = (data: DashboardPackage[]): PPUData[] => {
    const students = new Map<string, number>()
    data.forEach((d) => {
        if (students.has(d.studentId)) {
            students.set(d.studentId, students.get(d.studentId)! + 1)
        } else {
            students.set(d.studentId, 1)
        }
    })
    const result: PPUData[] = []
    students.forEach((value, key) => {
        result.push({
            studentId: key,
            num_packages: value
        })
    })
    return result.sort((a, b) => b.num_packages - a.num_packages).reverse()
}

const getMedianNumPkgs = (data: PPUData[]): number => {
    const numStudents = data.length
    const medianIndex = Math.floor(numStudents / 2)
    return data[medianIndex].num_packages
}

const numPackagesInPercentile = (data: PPUData[], percentile: number): number => {
    // for the top PERCENTILE, figure out how many total packages are in that percentile. eg for 10%, first find the 10th percentile, then sum up all the packages in that percentile
    data.reverse()
    const numStudents = data.length
    const percentileIndex = Math.floor(numStudents * (percentile / 100))
    const percentileStudent = data[percentileIndex]
    const percentileValue = percentileStudent.num_packages
    let total = 0
    for (let i = 0; i < percentileIndex; i++) {
        total += data[i].num_packages
    }
    return total
}

const avgPackages = (data: PPUData[]): string => {
    let total = 0
    data.forEach((d) => {
        total += d.num_packages
    })
    return (total / data.length).toFixed(0)
}


export default function PackagesByStudentBarChart(props: Props) {
    const data = getPackagesPerUser(props.data)
    const totalPackages = props.data.length

    return (
        <>
        <div className="w-full h-[50vh] flex flex-row justify-start items-start mt-4">
            <ResponsiveContainer width="70%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="studentId" angle={85} label="Students" tick={false}/>
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} content={<p>Distribution of Packages by Student</p>} />
                    <ReferenceLine y={0} stroke="#000" />
                    {/* <Brush dataKey="studentId" height={30} stroke="#8884d8" /> */}
                    <Bar dataKey="num_packages" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-col items-start my-11 border-gray-900 px-2 w-[40%]">
                <TypographyP className=""><strong>Percentile Breakdown:</strong></TypographyP>
                <TypographyP>- The top decile of students contribute a total of <strong>{numPackagesInPercentile(data.slice(), 10)}</strong> packages, which is <strong>{(100 *numPackagesInPercentile(data.slice(), 10) / totalPackages).toFixed(1)}%</strong> of the total.</TypographyP>
                <TypographyP>- The top quartile of students contribute a total of <strong>{numPackagesInPercentile(data.slice(), 25)}</strong> packages, which is <strong>{(100 *numPackagesInPercentile(data.slice(), 25) / totalPackages).toFixed(1)}%</strong> of the total.</TypographyP>
                <TypographyP>- The top student had <strong>{data[data.length - 1].num_packages}</strong> packages, while the median student had <strong>{getMedianNumPkgs(data)}</strong> packages. On average, a student received <strong>{avgPackages(data)}</strong> packages.</TypographyP>
            </div>
        </div>
        </>
    );
};