import { Box, Button } from "@mui/material";

import Link from "next/link";

export default function Home() {
    return(
        <Box sx={{
            // center on page, with buttons set with space between and increased in size
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <div>
                <Link href='/add'>
                    <Button>Register new packages</Button>
                </Link>
                
                <Link href='/retrieve'>
                    <Button>Retrieve packages</Button>
                </Link>
            </div>
            {/* <div>
                <Link href='/admin'>
                    <Button>Admin</Button>
                </Link>
            </div> */}
        </Box>
    )
}