  "use client";
  import {
    TextField as MuiTextField,
    TextFieldProps,
  } from "@mui/material";

  const TextField = ({ ...props }: TextFieldProps) => {
    return <MuiTextField variant="outlined" fullWidth {...props} />;
  };

  export { TextField }; 
