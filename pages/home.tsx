import { Box, Button } from "@mui/material";

import Add from "@/components/Add";
import Popup from "@/components/Popup";
import Retrieve from "@/components/Retrieve";
import styles from '@/styles/Home.module.css'
import { useState } from "react";

export default function Home() {
    const [openAdd, setOpenAdd] = useState(false)
    const [openRetrieve, setOpenRetrieve] = useState(false)
    
    return(
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
                    className={styles.button}
                    onClick={() => setOpenAdd(true)}
                >
                    Register new packages
                </Button>
                <Button 
                    className={styles.button}
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
            {/* <div>
                <Link href='/admin'>
                    <Button>Admin</Button>
                </Link>
            </div> */}
        </Box>
    )
}