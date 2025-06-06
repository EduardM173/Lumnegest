import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Props{
  label:string;
  name:string;
  value:string;
  onChange: (e:React.ChangeEvent<HTMLInputElement>)=>void;
  error?:boolean;
  helperText?:string;
}

export default function PasswordField(p:Props){
  const [show,setShow]=React.useState(false);
  return (
    <TextField
      {...p}
      type={show?'text':'password'}
      fullWidth
      margin="normal"
      InputProps={{
        endAdornment:(
          <InputAdornment position="end">
            <IconButton onClick={()=>setShow(v=>!v)} edge="end">
              {show? <VisibilityOff/>:<Visibility/>}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
