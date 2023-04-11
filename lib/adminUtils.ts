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



export { resetPass, compareDateStrings }