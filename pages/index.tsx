import { Button } from "@mantine/core";
import Link from "next/link";

export default function Index() {
    return(
        <div className="flex flex-auto items-center justify-center w-[100vw] h-[100vh] bg-sky-800">
            <div className="bg-stone-100 rounded-lg shadow-lg p-10 m-4 w-[35vw] h-[30vh] justify-center items-center">
                <h1 className="text-2xl font-bold text-center">Marquette Mailroom</h1>
                <hr />
                <div className="flex p-4 m-4 flex-row justify-center items-center">
                    <Link href="/dashboard">
                        <Button className="m-1">DR Dashboard</Button>
                    </Link>
                    <Link href="/admin">
                        <Button className="m-1">Admin Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}