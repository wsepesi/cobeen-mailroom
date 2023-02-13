import { Autocomplete, Button, TextField } from "@mui/material";

import { Student } from "./api/get-students";
import useSWR from 'swr'
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json())

type Data = {
    students: Student[]
}

const useStudentNames = () => {
    const { data, error, isLoading } = useSWR<Data, any, any>('/api/get-students', fetcher);

    console.log(data)

    if (data === undefined) return {student_names: [], isLoading, isError: new Error('No data')}

    const student_names = data.students.map((student) => student.Age).slice(0, 10)

    console.log(student_names)

    return {
        student_names,
        isLoading,
        isError: error
    }
}

const Add = () => {
    const [student, setStudent] = useState<Student>()
    const { student_names, isLoading, isError } = useStudentNames()


    // TODO: refactor student_names to students, select from form
    return(
        <>
            <h1>Register new packages</h1>
            <div>
                {isLoading && <p>Loading...</p>}
                {(!isLoading && isError) && <p>Failed to load</p>}   
                {student_names && <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={student_names}
                    sx={{ width: 300 }}
                    // getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField 
                            {...params} 
                            label="Student"
                            // onChange={(e) => setStudent(e.target.value)}
                        >{student?.Age}</TextField>}
                />}
            </div>
        </>
    )
}

export default Add