import { Button, CircularProgress, Input, Typography } from "@mui/material";
import { resetPass, uploadFile } from "@/lib/adminUtils";

import Head from "next/head";
import LoggedTable from "@/components/LoggedTable";
import Login from "@/components/Login";
import PackagesTable from "@/components/PackagesTable";
import Popup from "@/components/Popup";
import { useState } from "react";

export default function Admin() {
    const COBEEN_HOME = 'cobeen-home'
    const COBEEN_ADMIN = 'cobeen-admin'
    const KEY = 'cobeen-admin'
    const COBEEN = 'cobeen'
    
    const [homePassOpen, setHomePassOpen] = useState(false)
    const [adminPassOpen, setAdminPassOpen] = useState(false)
    const [homePass, setHomePass] = useState('')
    const [adminPass, setAdminPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false || process.env.NODE_ENV === 'development')
    const [rosterOpen, setRosterOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    return(
        <>
            <Head>
                <title>Cobeen Admin Dash</title>
            </Head>
            {isLoggedIn ? 
            <div className="flex flex-col min-h-screen min-w-[90vw] ml px-[5vw]">
                <h1 className="position absolute top-0 left-0 m-2">Admin Dash</h1>
                <div className="flex flex-row justify-start mt-10">
                    <div className="flex flex-col max-w-[25vw] items-start justify-start text-left mx-2 px-2 outline-black">
                        <Typography variant="subtitle1">Reset Passwords:</Typography>
                        <Button className="text-left" onClick={() => setHomePassOpen(true)}>Home</Button>
                        <Button className="text-left" onClick={() => setAdminPassOpen(true)}>Admin</Button>
                        <hr />
                        {/* <Typography variant="subtitle1">Import Roster</Typography>
                        <Button className="text-left" onClick={() => setRosterOpen(true)}>Import Roster</Button> */}
                    </div>
                    <div className="relative min-w-[80vw]">
                        <PackagesTable />
                        <LoggedTable />
                    </div>
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
                            <Button onClick={() => resetPass(homePass, setHomePassOpen, COBEEN_HOME, setHomePass, setIsLoading)}>Reset</Button>
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
                            <Button onClick={() => resetPass(adminPass, setAdminPassOpen, COBEEN_ADMIN, setAdminPass, setIsLoading)}>Reset</Button>
                        </div>
                    }
                </Popup>
                <Popup
                    open={rosterOpen}
                    handleClose={() => setRosterOpen(false)}
                    title="Load Roster"
                >
                    <div className="h-full flex flex-col justify-between">
                        <div className="flex flex-col justify-start items-start mb-[20vh]">
                            <p>Upload an .xlsx file to replace the current Cobeen roster</p>
                            <p>NOTE: Row 1 MUST be the columns, and rows 2 through n are data entries. Please trim related details before uploading.</p>
                        </div>
                        {isLoading ? 
                            <CircularProgress /> :
                            <div className="flex flex-row">
                                <input type="file" accept=".xlsx" onChange={handleFile}/>
                                <button disabled={!file} onClick={uploadFile}>Upload</button>
                            </div>
                        }
                    </div>
                </Popup>
            </div>
            :
                <Login pageKey={KEY} setIsLoggedIn={setIsLoggedIn} admin={true}/>
            }
        </>
    )
}