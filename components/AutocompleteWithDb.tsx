import { AcProps, Data, MaybeData } from "@/lib/types";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const useData = (apiRoute: string): MaybeData => {
    const { data, error, isLoading } = useSWR<Data, any, any>(`/api/${apiRoute}`, fetcher);
    if (data === undefined) return {records: null, isLoading, isError: new Error('No data... if this is a mistake, please contact the facilities manager')}
    const records = data.records

    return {
        records,
        isLoading,
        isError: error
    }
}

const AutocompleteWithDb = (props: AcProps): ReactElement => {
    const { apiRoute, acLabel, displayOption, record, setRecord, setLoaded } = props
    const [inputValue, setInputValue] = useState<string>('')
    const { records, isLoading, isError } = useData(apiRoute)

    useEffect(() => {
        if (records !== null) {
            setLoaded(true)
        }
    }, [records, setLoaded])

    return(
        <>
            {isLoading && <CircularProgress /> }
            {(!isLoading && isError) && <p>{isError.message}</p>}   
            {records && 
                <div>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        autoHighlight
                        options={records}
                        onChange={(_, newValue) => {
                            setRecord(newValue)
                        }}
                        inputValue={inputValue}
                        onInputChange={(_, newInputValue) => {
                        setInputValue(newInputValue)
                        }}
                        sx={{ width: 300 }}
                        value={record}
                        getOptionLabel={(option) => displayOption(option)}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {displayOption(option)}
                            </Box>
                        )}  
                        renderInput={(params) => <TextField 
                                {...params} 
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                                label={acLabel}
                        />}
                    />
                </div>
            }
        </>
    )
}

export default AutocompleteWithDb