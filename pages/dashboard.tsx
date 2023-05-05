import PackageTotal from "@/components/PackageTotal";
import { Text } from "@mantine/core";
import { useUser } from "@clerk/nextjs";

type ClerkData = {
    "hall": "cobeen" | "all",
    "role": "DR" | "Admin"
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser()

    if (!isLoaded || !isSignedIn) {
        return null
    }

    const userData = user.publicMetadata as ClerkData
    return (
        <div className="w-[90vw] h-[100vh] px-[5vw] flex flex-auto items-center justify-start">
            <Text size="lg">{capitalizeFirstLetter(userData.hall)} Mailroom</Text>
            <div>
                <PackageTotal 
                    hall={userData.hall}
                    text="Current Outstanding Packages" 
                    variant="current"
                />
                <PackageTotal 
                    hall={userData.hall}
                    text="Total Processed Pacakges" 
                    variant="retrieved"
                />
            </div>
            <div>
                {/* <Register />
                <Retrieve /> */}
            </div>
        </div>
    )
}


// import { Box, Button, IconButton } from "@mui/material";
// import { useEffect, useState } from "react";

// import Add from "@/components/Add";
// import Head from "next/head";
// import Login from "@/components/Login";
// import Popup from "@/components/Popup";
// import { Refresh } from "@mui/icons-material";
// import Retrieve from "@/components/Retrieve";

// const styles = {
//     padding: "0.5em 1em",
//     fontSize: "1.2em",
//     margin: "0.5em"
// }
// const KEY = 'cobeen-home'

// const getNumPackages = async (): Promise<number> => {
//     const res = await fetch('/api/get-packages')
//     const data = await res.json()
//     return data.records.length
// }

// export default function Home() {
//     const [numPackages, setNumPackages] = useState<number>(0)
//     const [loaded, setLoaded] = useState<boolean>(false)
//     const [openAdd, setOpenAdd] = useState<boolean>(false)
//     const [openRetrieve, setOpenRetrieve] = useState<boolean>(false)
//     const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false || process.env.NODE_ENV === 'development')

//     const getNum = async () => {
//         const num = await getNumPackages()
//         setNumPackages(num)
//         setLoaded(true)
//     }

//     useEffect(() => {
       
//         getNum()
//     }, [])
    
//     return(
//         <>
//         <Head>
//             <title>Cobeen Mailroom</title>
//         </Head>
//         {isLoggedIn ?
//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 alignContent: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//             }}>
//                 <div>
//                     <div className="absolute top-0 right-0 m-4">
//                         {loaded && 
//                             <div className="flex flex-row items-center">
//                                 <p>Total Packages in System: {numPackages}</p>
//                                 <IconButton onClick={getNum}>
//                                     <Refresh />
//                                 </IconButton>
//                             </div>
//                         }
//                     </div>
//                     <Button 
//                         sx={styles}
//                         onClick={() => setOpenAdd(true)}
//                     >
//                         Register new packages
//                     </Button>
//                     <Button 
//                         sx={styles}
//                         onClick={() => setOpenRetrieve(true)}
//                     >
//                         Retrieve packages
//                     </Button>

//                     <Popup
//                         open={openAdd}
//                         handleClose={() => setOpenAdd(false)}
//                         title="Register new packages"
//                     >
//                         <Add />
//                     </Popup>
//                     <Popup
//                         open={openRetrieve}
//                         handleClose={() => setOpenRetrieve(false)}
//                         title="Retrieve packages"
//                     >
//                         <Retrieve />
//                     </Popup>
//                 </div>
//             </Box>
//             :
//             <Login pageKey={KEY} setIsLoggedIn={setIsLoggedIn} admin={false}/>
//             }
//         </>
//     )
// }