import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import "./Components.css"

export const CipherForm = ({cipher, flavor}) => {
    return (
        <div className="view">
             <Box>
                <form>
                    <Stack spacing={2}>
                        <TextField type="file"/>
                        <Stack direction={"row"} spacing={1} style={{justifyContent: "center"}}>
                            <Button
                                variant="contained"
                                component="span"
                            >
                                Encrypt as Text
                            </Button>
                            <Button
                                variant="contained"
                                component="span"
                            >
                                Encrypt as File
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </div>
    )
}