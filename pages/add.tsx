import { Autocomplete, Button } from "@mui/material";

import Link from "next/link";

const Add = () => {
    return(
        <>
            <h1>Register new packages</h1>
            <div>
                {/* <Autocomplete>

                </Autocomplete> */}
                <Link href='/missing_name'>
                    <Button>Report missing name</Button>
                </Link>
            </div>
        </>
    )
}

export default Add