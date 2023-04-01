import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"

import { useState } from "react"

type Props = {
    open: boolean,
    handleClose: () => void,
}

const ReportName = (props: Props) => {
    const { open, handleClose } = props
    const [ name, setName ] = useState("")

    const logMissing = async () => {
        if (name === "") {
            alert('Please enter a name')
            handleClose()
        } else {
            const res = await fetch('/api/report-missing-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(name)
            })

            if (res.status === 200) {
                alert('Please put the package in the designated bucket. An email has been sent to the facilities manager to alert them of the situation.')
            } else {
                alert('There was an error reporting the missing name via email. Please speak to the facilities manager directly.')
            }
            
            handleClose()
        }
    }

    const closeAndWipe = () => {
        setName("")
        handleClose()
    }   

    return(
    <Dialog open={open} onClose={closeAndWipe}>
        <DialogTitle>Report Missing Name</DialogTitle>
        <DialogContent>
        <DialogContentText>
            Report a package with a name not on the resident list. This will log the package as delivered to the wrong hall.
        </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Student Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </DialogContent>
        <DialogActions>
            <Button onClick={closeAndWipe}>Cancel</Button>
            <Button onClick={logMissing}>Submit Name</Button>
        </DialogActions>
    </Dialog>)
}

export default ReportName