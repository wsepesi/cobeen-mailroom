import { AcProps, Package, PackageNoIds, Student } from "@/lib/types";
import { Alert, Box, Button, CircularProgress, Collapse, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

import AutocompleteWithDb from "@/components/AutocompleteWithDb";
import ReportName from "./ReportName";
import { useState } from "react";

const Add = () => {
    const [addingPackage, setAddingPackage] = useState(false)
    const [addedPackage, setAddedPackage] = useState<null | Package>(null)
    const [carrier, setCarrier] = useState<string | null>(null)
    const [record, setRecord] = useState<Record<string, any> | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [noName, setNoName] = useState(false)

    const failPackage = async (pkg: Package) => {
        // cleanup
        setAddingPackage(false)
        setAddedPackage(pkg)
        setRecord(null)

        // send off to DB
        const res = await fetch('/api/fail-package', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pkg)
        })
    }

    const addPackage = async (obj: Student | null) => {
        if (obj === null || carrier === null) {
            alert('Please select a student')
        } else {
            setAddingPackage(true)

            console.log(obj)

            const pkg: PackageNoIds = {
                First: obj.First_Name,
                Last: obj.Last_Name,
                Email: obj.Default_Email,
                provider: carrier,
                studentId: obj.University_ID
            }
            
            const res = await fetch('/api/add-package', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pkg)
            })

            if (res.status !== 200) {
                if (res.status === 501) {
                    console.error('Unforseen error. Please contact Dominic Barry')
                    console.error(await res.text())
                } else {
                    console.log("entering failure recovery mode")
                    failPackage(await res.json())
                }
            } else {
                const added_package: Package = await res.json()

                console.log('added pkg', added_package)

                setAddingPackage(false)
                setAddedPackage(added_package)
                setRecord(null)
            }
        }
    }

    const handleNoName = () => {
        setNoName(true)
    }

    const handleCarrierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCarrier((event.target as HTMLInputElement).value);
    };

    const props: AcProps = {
        apiRoute: 'get-students',
        acLabel: 'Student',
        displayOption: (student: Student) => `${student.Last_Name}, ${student.First_Name}`,
        record: record,
        setRecord: setRecord,
        setLoaded
    }

    const handleSubmit = () => {
        addPackage(record as Student)
    }

    const handleClose = () => {
        setNoName(false)
    }

    return(
        <Box sx={{ 
            mt: 3, 
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
            {!addingPackage && 
                <>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <AutocompleteWithDb {...props }/>
                        {(loaded && (record === null)) && <Button
                            sx={{
                                color: 'error.main',
                                borderColor: 'error.main',
                                '&:hover': {
                                    color: 'error.dark',
                                    borderColor: 'error.dark',
                                },
                                ml: 1
                            }}
                            onClick={handleNoName}
                        >Report Missing Name</Button>}
                    </Box>
                    <ReportName open={noName} handleClose={handleClose}/>
                    <Collapse in={record !== null}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <FormControl sx={{ mt: 2 }}>
                                <FormLabel id="provider">Select the Package Carrier</FormLabel>
                                <RadioGroup
                                    aria-labelledby="carrer-buttons-group"
                                    name="carrer-buttons-group"
                                    value={carrier}
                                    onChange={handleCarrierChange}
                                >
                                    <FormControlLabel value="Amazon" control={<Radio />} label="Amazon" />
                                    <FormControlLabel value="USPS" control={<Radio />} label="USPS" />
                                    <FormControlLabel value="UPS" control={<Radio />} label="UPS" />
                                    <FormControlLabel value="Fedex" control={<Radio />} label="Fedex" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                            <Collapse in={carrier !== null}>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSubmit}
                                    sx={{
                                        mt: 2,
                                        // color: 'primary.main',
                                    }}
                                >
                                    Add Package
                                </Button>
                            </Collapse>
                        </Box>
                    </Collapse>
                    
                </>
            }
            <Box sx={{ 
                width: '100%',
                position: 'absolute',
                bottom: 0,
            }}>
                <Collapse in={addedPackage !== null}>
                    <Alert onClose={() => setAddedPackage(null)}>
                        Package added for {addedPackage?.Last}, {addedPackage?.First} with package number #{addedPackage?.packageId}. Write this on the box!
                    </Alert>
                </Collapse>
            </Box>
            {addingPackage && <CircularProgress />}
        </Box>
    )
}

export default Add