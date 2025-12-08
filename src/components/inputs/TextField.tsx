  "use client";
  import {
    TextField as MuiTextField,
    TextFieldProps,
  } from "@mui/material";

  const TextField = ({ ...props }: TextFieldProps) => {
<<<<<<< HEAD
    return <MuiTextField variant="outlined" fullWidth {...props}  
      sx={{ 
           maxWidth: '500px',
           boxSizing: 'border-box',
     }}/>;
  };

  export { TextField };
=======
    return <MuiTextField variant="outlined" fullWidth {...props} />;
  };

  export { TextField };
>>>>>>> 147f3376b56b8579c8dfd3621d0a34fe99c66b08
