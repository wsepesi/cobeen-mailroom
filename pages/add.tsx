import { Autocomplete, Box, Button, TextField } from "@mui/material";
import AutocompleteWithDb, { AcProps } from "@/components/AutocompleteWithDb";

import GoBack from "@/components/GoBack";
import { Package } from "./api/add-package";
import { Student } from "./api/get-students";

const addPackage = async (obj: Student | null) => {
    if (obj === null) throw new Error('No student selected')

    const res = await fetch('/api/add-package', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    const added_package: Package = await res.json()

    console.log(added_package)

    alert(`Package added for ${added_package.Last}, ${added_package.First} with ID (${added_package.packageId})`)
}
const Add = () => {

    const props: AcProps = {
        apiRoute: 'get-students',
        submit: addPackage,
        acLabel: 'Student',
        buttonLabel: 'Add package',
        displayOption: (student: Student) => `${student.Last_Name}, ${student.First_Name}`,
        reload: false
    }

    return(
        <Box sx={{
            // center on page and align all internal elements to center
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <h1>Register new packages</h1>
            <AutocompleteWithDb {
                ...props
            }
            />
            <GoBack />
        </Box>
    )
}

// const Add = () => {
//     const [student, setStudent] = useState<Student | null>(null)
//     const [inputValue, setInputValue] = useState<string>('')
//     const { students, isLoading, isError } = useStudents()

//     const handleSubmit = handleErrors(async () => {
//         try {
//             await addPackage(student)
//         } catch (error) {
//             alert("An error has occured. Please speak to the facilities manager")
//         }
//     })

//     const handleGoBack = () => {
//         window.history.back()
//     }

//     return(
//         <>
//             <h1>Register new packages</h1>
//             <div>
//                 {isLoading && <p>Loading...</p>}
//                 {(!isLoading && isError) && <p>Failed to load</p>}   
//                 {students && 
//                     <div>
//                         <Autocomplete
//                             disablePortal
//                             id="combo-box-demo"
//                             autoHighlight
//                             options={students}
//                             onChange={(_, newValue) => {
//                                 setStudent(newValue)
//                             }}
//                             inputValue={inputValue}
//                             onInputChange={(_, newInputValue) => {
//                             setInputValue(newInputValue)
//                             }}
//                             sx={{ width: 300 }}
//                             value={student}
//                             getOptionLabel={(option) => `${option.Last_Name}, ${option.First_Name}`}
//                             renderOption={(props, option) => (
//                                 <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
//                                 {option.Last_Name}, {option.First_Name}
//                                 </Box>
//                             )}  
//                             renderInput={(params) => <TextField 
//                                     {...params} 
//                                     inputProps={{
//                                         ...params.inputProps,
//                                         autoComplete: 'new-password', // disable autocomplete and autofill
//                                     }}
//                                     label="Student"   
//                             />}
//                         />
//                         <Button variant="contained" onClick={handleSubmit}>Add</Button>
//                     </div>
//                 }
//             </div>
//             <Button onClick={handleGoBack}>Go back</Button>
//         </>
//     )
// }

export default Add