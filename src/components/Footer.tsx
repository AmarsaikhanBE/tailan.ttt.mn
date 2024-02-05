import * as M from '@mui/material';

export default () => (
  <M.AppBar position="static">
    <M.Toolbar variant="dense">
      <M.Typography variant="body2" flex={1} textAlign="center">
        Мэдээлэл, технологийн хэлтэс &copy; {new Date().getFullYear()}он
      </M.Typography>
    </M.Toolbar>
  </M.AppBar>
);
