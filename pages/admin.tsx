import { Button, CircularProgress, Input, Typography } from "@mui/material";

import Login from "@/components/Login";
import Popup from "@/components/Popup";
import { useState } from "react";

export default function Admin() {
    const COBEEN_HOME = 'cobeen-home'
    const COBEEN_ADMIN = 'cobeen-admin'
    const KEY = 'cobeen-admin'
    
    const [homePassOpen, setHomePassOpen] = useState(false)
    const [adminPassOpen, setAdminPassOpen] = useState(false)
    const [homePass, setHomePass] = useState('')
    const [adminPass, setAdminPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const resetPass = async (passVal: string, setPassOpen: (arg0: boolean) => void, key: string, setPass: ((arg0: string) => void)) => {
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



    return(
        <>
            {isLoggedIn ? 
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300">
                <h1 className="position absolute top-0 left-0 m-2">Admin Dash</h1>
                <div>
                    <Typography variant="body1" className="text-2xl">Reset Passwords:</Typography>
                    <Button onClick={() => setHomePassOpen(true)}>Reset Password for Home</Button>
                    <Button onClick={() => setAdminPassOpen(true)}>Reset Password for Admin</Button>
                </div>
                
                <Popup 
                    open={homePassOpen} 
                    handleClose={() => setHomePassOpen(false)} 
                    title="Reset Password for Home"
                >
                    <p>Enter a new password for the home page</p>
                    {isLoading ? 
                        <CircularProgress /> :
                        <div>
                            <Input value={homePass} onChange={(e) => setHomePass(e.target.value)} />
                            <Button onClick={() => resetPass(homePass, setHomePassOpen, COBEEN_HOME, setHomePass)}>Reset</Button>
                        </div>
                    }
                </Popup>
                <Popup
                    open={adminPassOpen}
                    handleClose={() => setAdminPassOpen(false)}
                    title="Reset Password for Admin"
                >
                    <p>Enter a new password for the admin page</p>
                    {isLoading ? 
                        <CircularProgress /> :
                        <div>
                            <Input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
                            <Button onClick={() => resetPass(adminPass, setAdminPassOpen, COBEEN_ADMIN, setAdminPass)}>Reset</Button>
                        </div>
                    }
                </Popup>
            </div>
            :
                <Login pageKey={KEY} setIsLoggedIn={setIsLoggedIn} admin={true}/>
            }
        </>
    )
}