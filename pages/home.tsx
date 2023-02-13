import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
    return(
        <>
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
        </>
    )
}