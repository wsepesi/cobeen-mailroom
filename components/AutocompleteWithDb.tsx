import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

import { handleErrors } from "@/lib/utility";
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

type Data = {
    records: Record<string, any>[]
}

type AcProps = {
    apiRoute: string,
    submit: (obj: any | null) => Promise<void>, //TODO: fix
    acLabel: string,
    buttonLabel: string,
    displayOption: (obj: any | null) => string //TODO: Fix
}

type MaybeData = {
    records: Record<string, any>[] | null,
    isLoading: boolean,
    isError: Error
}

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
    const { apiRoute, submit, acLabel, buttonLabel, displayOption } = props
    const [record, setRecord] = useState<Record<string, any> | null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const { records, isLoading, isError } = useData(apiRoute)

    const handleSubmit = handleErrors(async () => {
        // recall isData
        try {
            await submit(record)
            // refresh the page
            window.location.reload()
        } catch (error) {
            alert("An error has occured. Please speak to the facilities manager")
        }
    })

    return(
        <>
            {isLoading && <p>Loading...</p>}
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
                    <Button variant="contained" onClick={handleSubmit}>{buttonLabel}</Button>
                </div>
            }
        </>
    )
}

export default AutocompleteWithDb

export type { AcProps }