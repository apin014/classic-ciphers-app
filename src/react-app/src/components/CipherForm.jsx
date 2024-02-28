import React from "react";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from "axios"
import moment from "moment";
import { MuiFileInput } from "mui-file-input"
import FileSaver from "file-saver"
import Alert from '@mui/material/Alert';
import "./Components.css"

export const CipherForm = ({cipher, flavor, input}) => {
    const [text, setText] = React.useState("")
    const [file, setFile] = React.useState(null)
    const [sKey, setSKey] = React.useState("")
    const [nKey, setNKey] = React.useState(null)
    const [display, setDisplay] = React.useState("")
    const [error, setError] = React.useState("")

    const submit = (cipher, flavor, input, out) => {
        let body = {}
        let formData = new FormData()
        if (input === "text") {
            body.text = text
            body.key = sKey
            body.lKey = nKey
        }
        else {
            formData.append("file", file)
            formData.append("key", sKey)
            formData.append("lKey", nKey)
        }
        console.log(cipher)
        let config = {}
        config.params = {}
        config.params.flavor = flavor
        config.params.out = out
        if (input === "file") {
            config.headers = {
                "Content-Type": "multipart/form-data"
            }
        }

        if (out === "file") {
            config.responseType = "blob"
        }

        return axios.post(`http://localhost:3636/${cipher}/${input}`, input === "text" ? body : formData, config)
        .then((resp) => {
            if (out === "file") {
                FileSaver.saveAs(resp.data, `baru_${moment.now().toString()}`)
            }
            else {
                let msg = resp.data.message 
                if (flavor === "encrypt") {
                    msg += " (base64)"
                }
                setDisplay(msg)
            }
        })
        .catch((error) => {
            if (error.response) {
                setError("An error occurred, possibly due to invalid input")
            }
        })
    }

    const handleText = (event) => {
        setText(event.target.value)
    }
    
    const handleFile = (newFile) => {
        setFile(newFile)
    }

    const handleSKey = (event) => {
        setSKey(event.target.value)
    }

    const handleNKey = (event) => {
        setNKey(event.target.value)
    }

    return (
        <div className="view">
             <Box>
                <form>
                    {(cipher) &&
                        <React.Fragment>
                            <Stack spacing={2}>
                                {input === "text" && 
                                    <Stack spacing={1} style={{justifyContent: "center"}}>
                                        <TextField 
                                            value={text} 
                                            onChange={handleText} 
                                            type="text" placeholder="Insert Text Here" 
                                            error={text === ""} 
                                            helperText={text === "" ? "Do not leave empty" : ""}/>
                                    </Stack>
                                    
                                }
                                {input === "file" &&
                                    <FormControl>
                                        {/* <TextField 
                                            type="file"
                                            value={file}
                                            onChange={handleFile}
                                            error={file === null}/> */}
                                        <MuiFileInput
                                            value={file}
                                            onChange={handleFile}
                                            placeholder={"Insert File Here"}
                                            error={!file}
                                            helperText={file ? "" : "Do not leave empty"} />
                                            
                                    </FormControl>
                                }
                                <TextField 
                                    type="text"
                                    value={sKey} 
                                    onChange={handleSKey}
                                    placeholder="Insert Key Here" 
                                    style={{width: "25vw"}}
                                    error={sKey === ""} 
                                    helperText={sKey === "" ? "Do not leave empty" : ""}/>
                                {cipher === "product" &&
                                    <TextField 
                                            type="number" 
                                            value={nKey} 
                                            onChange={handleNKey}
                                            placeholder="Insert Transposition Key Here" 
                                            style={{width: "25vw"}}
                                            InputProps={{
                                                inputProps: { min: 1}
                                            }}
                                            error={!nKey} 
                                            helperText={nKey ? "" : "Do not leave empty"}/>
                                }
                                {flavor === "encrypt" && input &&
                                    <Stack direction={"row"} spacing={1} style={{justifyContent: "center"}}>
                                        <Button
                                            variant="contained"
                                            component="span"
                                            onClick={() => submit(cipher, flavor, input, "file")}
                                        >
                                            Encrypt to File
                                        </Button>
                                        {input === "text" &&
                                            <Button
                                                variant="contained"
                                                component="span"
                                                onClick={() => submit(cipher, flavor, input, "text")}
                                            >
                                                Encrypt to Text
                                            </Button>
                                        }
                                        
                                    </Stack>
                                }
                                {flavor === "decrypt" && input &&
                                    <Stack direction={"row"} spacing={1} style={{justifyContent: "center"}}>
                                        {input === "text" &&
                                            <Button
                                                variant="contained"
                                                component="span"
                                                onClick={() => submit(cipher, flavor, input, "text")}
                                            >
                                                Decrypt to Text
                                            </Button>
                                        }
                                        <Button
                                            variant="contained"
                                            component="span"
                                            onClick={() => submit(cipher, flavor, input, "file")}
                                        >
                                            Decrypt to File
                                        </Button>
                                    </Stack>
                                }
                                {cipher && input === "text" && flavor &&
                                    <TextField
                                        value={display}
                                        disabled
                                    />
                                }
                                {error !== "" &&
                                    <Alert severity="error">{error}</Alert>
                                }
                            </Stack>
                        </React.Fragment>
                    }
                </form>
            </Box>
        </div>
    )
}