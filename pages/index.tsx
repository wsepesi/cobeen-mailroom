import { Box, Button, Input, TextField, Typography } from "@mui/material";
import { NextRouter, useRouter } from "next/router";

import Head from "next/head";
import styles from '@/styles/Home.module.css'
// import bcrypt from 'bcrypt';
import { useState } from "react";

// const handleClick = (router: NextRouter) => {
//     router.push('/home')
// }


export default function Login() {
    const router = useRouter();
    // const router = useRouter();
    // const { data, error, isLoading } = useSWR('/api/hello', fetcher);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // const useLogin = async () => {
    //     const saltRounds = 10
    //     // first salt password with bcrypt:
    //     const salt = await bcrypt.genSalt(saltRounds)
    //     const hashedPassword = await bcrypt.hash(password, salt)
    //     // send to server
    //     const res = await axios.post('/api/login', {
    //         username: username,
    //         password: hashedPassword
    //     })
        
    //     // destructure axios response
    //     const { data, status } = res

    //     // if login is successful, redirect to home page
    //     if (status === 200) {
    //         console.log('login successful')
    //     }

    //     // if login is unsuccessful, display error message
    //     if (status === 401) {
    //         console.log('login unsuccessful')
    //     }
    // }

    const useLoginTemp = () => {
        // reroute to home page
        router.push('home')
    }


    // if (error) return <div>Failed to load</div>
    // if (isLoading) return <div>Loading...</div>
    // if (!data) return null

    // console.log(data)

    return(
        <Box sx={{
            // center horizontally and vertically
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            height: '100vh',
            // color: "#eab676"
        }}>
            <Head>
                <title>Mailroom Login</title>
                <meta name="description" content="Login page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h5>Temporary Login Placeholder</h5>
                {/* <Typography variant='h1'>Mailroom Management Login</Typography> */}
                {/* <TextField id="username" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField id="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                <Button onClick={useLoginTemp}>Continue to Home</Button> 
            </main>
        </Box>
    )
}