'use client';

import { Suspense, useMemo } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';

export default ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: { main: '#f19921', contrastText: '#fff' },
        },
        typography: { fontFamily: 'Montserrat, sans-serif' },
      }),
    [prefersDarkMode]
  );

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense>{children}</Suspense>
        <SnackbarProvider maxSnack={5} />
      </ThemeProvider>
    </SessionProvider>
  );
};
