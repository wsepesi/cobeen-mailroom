import { Box, Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import useUser, { User } from 'lib/useUser'

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/home',
    redirectIfFound: true,
  })

  const [code, setCode] = useState<string>('')

//   const [errorMsg, setErrorMsg] = useState('')

  const handleClick = async () => {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: code
        }),
      })
    const data = await res.json() as User
    mutateUser(data)
  }

  return (
    <Box>
        <Typography variant="h4" gutterBottom>Input Login Code</Typography>
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
        <Button onClick={handleClick}>Go</Button>
    </Box>
    // <Layout>
    //   <div className="login">
    //     <Form
    //       errorMessage={errorMsg}
    //       onSubmit={async function handleSubmit(event) {
    //         event.preventDefault()

    //         const body = {
    //           username: event.currentTarget.username.value,
    //         }

    //         try {
    //           mutateUser(
    //             await fetchJson('/api/login', {
    //               method: 'POST',
    //               headers: { 'Content-Type': 'application/json' },
    //               body: JSON.stringify(body),
    //             })
    //           )
    //         } catch (error) {
    //           if (error instanceof FetchError) {
    //             setErrorMsg(error.data.message)
    //           } else {
    //             console.error('An unexpected error happened:', error)
    //           }
    //         }
    //       }}
    //     />
    //   </div>
    //   <style jsx>{`
    //     .login {
    //       max-width: 21rem;
    //       margin: 0 auto;
    //       padding: 1rem;
    //       border: 1px solid #ccc;
    //       border-radius: 4px;
    //     }
    //   `}</style>
    // </Layout>
  )
}