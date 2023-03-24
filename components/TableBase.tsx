import { Button, CircularProgress, IconButton, Input, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// import { ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ObjectId } from "mongodb";
import Refresh from "@mui/icons-material/Refresh";

// TODO: use this one as the template

interface TableProps<T> {
    fetcher: () => Promise<T[]>;
    columns: React.ReactElement<HeaderProps>;
    dataToRow: (data: T) => React.ReactElement<RowProps>;
    title: string
}

interface HeaderProps extends React.HTMLAttributes<HTMLTableCellElement> { 
    scope?: "col"
}  

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> { }

function BaseTable<T>(props: TableProps<T>) {
    const { fetcher } = props
    const [data, setData] = useState<T[]>([])
    const [expand, setExpand] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        setData(await fetcher())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        fetcher().then((data) => {
            setData(data)
            setLoading(false)
        })
    }, [fetcher])
    
    return (
        <>
        <div className="flex flex-col max-w-fit items-start justify-start text-left mx-2 px-2 transition ease-out duration-500">
            <div className="flex flex-row justify-between min-w-full">
                <div className="flex flex-row">
                <Typography variant="subtitle1">{props.title}</Typography>
                <IconButton onClick={fetchData} className="-mt-1">
                    <Refresh />
                </IconButton>
                </div>
                <IconButton onClick={() => setExpand(!expand)}>
                    {expand ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>
            <div className={`table-fixed w-full ${!expand && "max-h-[45vh] overflow-scroll"}`}>
            <table className={`table-fixed w-full`}>
                <thead>
                    <tr className="bg-gray-200">
                        {props.columns}
                    </tr>
                </thead>
                {!loading ? <tbody>
                    {data.map((pkg, i) => (
                    <tr key={i} className="bg-stone-300 outline outline-1">
                        {props.dataToRow(pkg)}
                    </tr>
                    ))}
                </tbody>
                :
                <Skeleton variant="rectangular" width="80vw" height="45vh" animation="wave" />
                }
            </table>
            </div>
        </div>
        {/* {!expandPackages && <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-gradient-to-t from-gray-400 to-transparent"></div>} */}
        </>
    )
}

export default BaseTable