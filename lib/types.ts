import { ObjectId } from "mongodb"

type Counter = {
    _id: ObjectId,
    seq_value: number
}

type PackageNoIds = {
    First: string,
    Last: string,
    Email: string,
    provider: string,
    studentId: string,
}

type Data = {
    records: Record<string, any>[]
}

type AcProps = {
    apiRoute: string,
    // submit: (obj: any | null) => Promise<void>, //TODO: fix
    acLabel: string,
    displayOption: (obj: any | null) => string, //TODO: Fix,
    // reload: boolean,
    record: Record<string, any> | null,
    setRecord: any, //TODO: fix
    setLoaded: any, //TODO: fix
}

type MaybeData = {
    records: Record<string, any>[] | null,
    isLoading: boolean,
    isError: Error
}

type Package = {
    _id: ObjectId,
    First: string,
    Last: string,
    Email: string,
    packageId: number,
    provider: string,
    studentId: string,
}

type SafeRoster = {
    Last_Name: string,
    First_Name: string,
    University_ID: string,
    Default_Email: string,
}

type AmbigiousRoster = SafeRoster & {
    [key: string]: unknown,
}

type Roster = SafeRoster & {
    Age: string,
    Bed_Space: string,
    Rm_Type_Desc: string,
}

type Student = SafeRoster & {
    _id: ObjectId,
}

type FullStudent = Roster & {
    _id: ObjectId,
}

type LogPackageNoId = Omit<Package, "_id"> & {
    ingestedTime: Date,
    resolved: boolean
}

type LogPackage = LogPackageNoId & {
    _id: ObjectId
}

type KeyPair = {
    _id: ObjectId,
    key: string,
    pass: string
}

export type { Counter, PackageNoIds, Data, AcProps, MaybeData, Package, Student, LogPackageNoId, LogPackage, KeyPair, Roster, FullStudent, SafeRoster, AmbigiousRoster }