import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CipherForm } from './components/CipherForm';
import Stack from '@mui/material/Stack';
import "./App.css"

export const MainPage = () => {
    const [selected, setSelected] = React.useState("")
    const [chosen, setChosen] = React.useState("")
    const [picked, setPicked] = React.useState("")

    const handleSelect = (event) => {
        setSelected(event.target.value)
    }

    const handleChoose = (event) => {
        setChosen(event.target.value)
    }

    const handlePick = (event) => {
        setPicked(event.target.value)
    }
    
    return (
        <div className='Main-Page'>
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={1} style={{justifyContent: "center"}}>
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <InputLabel id="select-label-demo1">Cipher</InputLabel>
                        <Select
                            labelId="select-label-demo1"
                            id="demo"
                            value={selected}
                            onChange={handleSelect}
                            autoWidth
                            label="Please Select"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="vigenere">Standard Vigenere Cipher</MenuItem>
                            <MenuItem value="ext_vigenere">Extended Vigenere Cipher</MenuItem>
                            <MenuItem value="playfair">Playfair Cipher</MenuItem>
                            <MenuItem value="product">Product Cipher</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <InputLabel id="select-label-demo2">Encrypt/Decrypt</InputLabel>
                        <Select
                            labelId="select-label-demo2"
                            id="demo"
                            value={chosen}
                            onChange={handleChoose}
                            autoWidth
                            label="Please Select"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="encrypt">Encrypt</MenuItem>
                            <MenuItem value="decrypt">Decrypt</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <InputLabel id="select-label-demo3">Input Type</InputLabel>
                        <Select
                            labelId="select-label-demo3"
                            id="demo"
                            value={picked}
                            onChange={handlePick}
                            autoWidth
                            label="Please Select"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {selected === "vigenere" && chosen === "encrypt" &&
                                <React.Fragment>
                                    <MenuItem value="text">Text</MenuItem>
                                    <MenuItem value="file">File</MenuItem>
                                </React.Fragment>
                                
                            }
                        </Select>
                    </FormControl>
                </Stack>
                
                <CipherForm cipher={{}} flavor={{}}/>
            </Stack>
        </div>
    )
}