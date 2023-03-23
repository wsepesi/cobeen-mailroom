import { Box, Button } from "@mui/material";

import Add from "@/components/Add";
import Head from "next/head";
import Login from "@/components/Login";
import Popup from "@/components/Popup";
import Retrieve from "@/components/Retrieve";
import { useState } from "react";

const styles = {
    padding: "0.5em 1em",
    fontSize: "1.2em",
    margin: "0.5em"
}
const KEY = 'cobeen-home'

export default function Home() {
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const [openRetrieve, setOpenRetrieve] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false || process.env.NODE_ENV === 'development')
    
    return(
        <>
        <Head>
            <title>Cobeen Mailroom</title>
        </Head>
        {isLoggedIn ?
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}>
                <div>
                    <Button 
                        sx={styles}
                        onClick={() => setOpenAdd(true)}
                    >
                        Register new packages
                    </Button>
                    <Button 
                        sx={styles}
                        onClick={() => setOpenRetrieve(true)}
                    >
                        Retrieve packages
                    </Button>

                    <Popup
                        open={openAdd}
                        handleClose={() => setOpenAdd(false)}
                        title="Register new packages"
                    >
                        <Add />
                    </Popup>
                    <Popup
                        open={openRetrieve}
                        handleClose={() => setOpenRetrieve(false)}
                        title="Retrieve packages"
                    >
                        <Retrieve />
                    </Popup>
                </div>
            </Box>
            :
            <Login pageKey={KEY} setIsLoggedIn={setIsLoggedIn} admin={false}/>
            }
        </>
    )
}