import { CircularProgress } from "@mui/material"
import Link from "next/link"
import axios from "axios"
import { useState } from "react"

interface Props {
    setIsLoggedIn: (value: boolean) => void
    pageKey: string
    admin: boolean
}

const Login = (props: Props): React.ReactElement => {
    const { setIsLoggedIn, pageKey } = props
    const [input, setInput] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getHash = async (password: string) => {
        setIsLoading(true)
        setInput('')
        const { data, status } = await axios.post('/api/hash-pass', {
          params: {
            key: pageKey,
            password
          }
        })
      
        if (status !== 200) {
          console.log(status)
          alert('Something went wrong')
          throw new Error('Error')
        }
        else {
          const result = data.result as boolean
          if (!result) {
            alert('Incorrect password')
          }
          setIsLoggedIn(result)
        }
        setIsLoading(false)
      }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl">Cobeen {props.admin && "Admin"} Code</h1>
          {isLoading ? <CircularProgress /> :
            <div>
              <input onChange={(e) => setInput(e.target.value)} value={input} className="border-1 border-gray-500 rounded-md p-1 bg-stone-200" />
              <button onClick={() => getHash(input)}>Submit</button>
            </div>
          }
          <Link href={props.admin ? "/" : "/admin"} className="absolute bottom-0 right-0 m-2">{props.admin ? "Home" : "Admin"}</Link>
      </div>
    )
}


export default Login