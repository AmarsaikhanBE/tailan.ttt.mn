import * as M from '@mui/material';
import { Footer, Header } from '@/components';

export default ({ children }: { children: React.ReactNode }) => (
  <M.Box
    component="main"
    sx={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Header />
    {children}
    <Footer />
  </M.Box>
);
