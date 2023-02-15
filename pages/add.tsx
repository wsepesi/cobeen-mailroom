import { Autocomplete, Box, Button, TextField } from "@mui/material";

import { Package } from "./api/add-package";
import { Student } from "./api/get-students";
import { handleErrors } from "@/lib/utility";
import useSWR from 'swr'
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json())

type Data = {
    students: Student[]
}

const useStudents = () => {
    const { data, error, isLoading } = useSWR<Data, any, any>('/api/get-students', fetcher);
    if (data === undefined) return {students: [], isLoading, isError: new Error('No data')}
    const students = data.students

    return {
        students,
        isLoading,
        isError: error
    }
}

const addPackage = async (student: Student | null) => {
    if (student === null) throw new Error('No student selected')

    const res = await fetch('/api/add-package', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    })

    const added_package: Package = await res.json()

    alert(`Package added for ${added_package.Last}, ${added_package.First} with ID (${added_package.packageId})`)
}

const Add = () => {
    const [student, setStudent] = useState<Student | null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const { students, isLoading, isError } = useStudents()

    const handleClick = handleErrors(async () => {
        try {
            await addPackage(student)
        } catch (error) {
            alert(error)
        }
        
    })

    return(
        <>
            <h1>Register new packages</h1>
            <div>
                {isLoading && <p>Loading...</p>}
                {(!isLoading && isError) && <p>Failed to load</p>}   
                {students && 
                    <div>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            autoHighlight
                            options={students}
                            onChange={(_, newValue) => {
                                setStudent(newValue)
                            }}
                            inputValue={inputValue}
                            onInputChange={(_, newInputValue) => {
                            setInputValue(newInputValue)
                            }}
                            sx={{ width: 300 }}
                            value={student}
                            getOptionLabel={(option) => `${option.Last_Name}, ${option.First_Name}`}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option.Last_Name}, {option.First_Name}
                                </Box>
                            )}  
                            renderInput={(params) => <TextField 
                                    {...params} 
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                    label="Student"   
                            />}
                        />
                        <Button variant="contained" onClick={handleClick}>Add</Button>
                    </div>
                }
            </div>
        </>
    )
}

export default Add