import { NextRouter, useRouter } from "next/router";

import { Button } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import useSWR from 'swr'

const handleClick = (router: NextRouter) => {
    router.push('/home')
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Login() {
    const router = useRouter();
    const { data, error, isLoading } = useSWR('/api/hello', fetcher);


    if (error) return <div>Failed to load</div>
    if (isLoading) return <div>Loading...</div>
    if (!data) return null

    // console.log(data)

    return(
        <>
            <Head>
                <title>Mailroom Login</title>
                <meta name="description" content="Login page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Mailroom Management Login</h1>
                <Button onClick={() => console.log(data)}>Test</Button>
                {/* <h3>{data.map((item: string) => <p key='2'>{item}</p>)}</h3> */}
                <form>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                    <Button onClick={() => handleClick(router)}>Login (fake for now)</Button>
                </form>
            </main>
        </>
    )
}