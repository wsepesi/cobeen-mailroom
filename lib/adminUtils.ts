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

const uploadFile = async () => {
    alert('not implemented')
    throw new Error('not implemented')
    // if (file) {
        // setIsLoading(true)

        // // convert file to json. file is expected to be an xlsx file
        // const reader = new FileReader()
        // reader.onload = async (e) => {
        //     if (file) {
        //         const wb = XLSX.read(file, {type: 'file'})
        //         const wsname = wb.SheetNames[0]
        //         const ws = wb.Sheets[wsname]
        //         const json = XLSX.utils.sheet_to_json(ws, {header: 1})
        //         console.log(json)
        //         return json
        //     }
        // }
        
        

        // const fileJson = await reader.onload("")

        // const fileJson = await reader.onload()

        // console.log('fj', fileJson)            


    //     const res = await fetch('/api/upload-roster', {
    //         method: 'POST',
    //         body: file
    //     })
    //     console.log('res.status', res.status)
    //     setIsLoading(false)
    //     setRosterOpen(false)
    //     if (res.status === 200) {
    //         alert('Roster uploaded successfully')
    //         console.log(await res.json())
    //     } else {
    //         console.log(await res.json())
    //         alert('Something went wrong')
    //     }
    // }
}

export { resetPass, uploadFile }