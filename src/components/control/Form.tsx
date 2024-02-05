import * as M from '@mui/material';

export default (props: M.DialogProps) => (
  <M.Dialog
    {...props}
    component="form"
    fullWidth
    maxWidth="md"
    sx={{ backdropFilter: 'blur(5px)', '& .MuiPaper-root': { paddingY: 4 } }}
  />
);
