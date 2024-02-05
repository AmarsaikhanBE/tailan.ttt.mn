'use client';

import * as M from '@mui/material';
import * as I from '@mui/icons-material';

export default ({ title, action }: { title: string; action?: () => void }) => (
  <M.AppBar position="static" elevation={4} sx={{ borderRadius: 1 }}>
    <M.Toolbar sx={{ justifyContent: 'space-between' }}>
      <M.Typography variant="h5" color="whitesmoke">
        {title}
      </M.Typography>
      {action && (
        <M.Button
          disableElevation
          startIcon={<I.AddCircleOutline />}
          sx={{
            backgroundColor: 'whitesmoke',
            '&:hover': { color: 'whitesmoke' },
          }}
          onClick={action}
        >
          үүсгэх
        </M.Button>
      )}
    </M.Toolbar>
  </M.AppBar>
);
