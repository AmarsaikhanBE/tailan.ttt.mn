'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import { Logo } from '@/components';
import { enqueueSnackbar } from 'notistack';

export default () => {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visibility, setVisibility] = useState(false);
  const [credential, setCredential] = useState<any>({
    username: '',
    password: '',
    redirect: false,
  });

  if (status === 'authenticated')
    router.push(searchParams.get('callbackUrl') ?? '/');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await signIn('credentials', credential);

    if (res?.error)
      return enqueueSnackbar({
        message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.',
        variant: 'error',
      });
  };

  return (
    <M.Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      {status === 'loading' ? (
        <M.Box
          sx={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        >
          <Logo size="large" />
        </M.Box>
      ) : (
        <M.Fade in={status === 'unauthenticated'}>
          <M.Container component={M.Paper} maxWidth="xs">
            <M.Stack
              component="form"
              direction="column"
              gap={4}
              pt={4}
              pb={8}
              onSubmit={handleSubmit}
            >
              <Logo size="small" />
              <M.Typography
                variant="h6"
                textAlign="center"
                sx={{ textTransform: 'uppercase' }}
              >
                Тайлангийн систем
              </M.Typography>
              <M.Divider />
              <M.TextField
                label="Нэвтрэх нэр"
                onChange={(event) =>
                  setCredential({ ...credential, username: event.target.value })
                }
              />
              <M.TextField
                label="Нууц үг"
                type={visibility ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <M.Tooltip title={visibility ? 'нуух' : 'харуулах'}>
                      <M.InputAdornment
                        position="end"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { color: '#f19921' },
                        }}
                        onClick={() => setVisibility(!visibility)}
                      >
                        {visibility ? <I.VisibilityOff /> : <I.Visibility />}
                      </M.InputAdornment>
                    </M.Tooltip>
                  ),
                }}
                onChange={(event) =>
                  setCredential({ ...credential, password: event.target.value })
                }
              />
              <M.Divider />
              <M.Button
                type="submit"
                variant="contained"
                sx={{ marginX: 'auto', color: 'whitesmoke' }}
              >
                Нэвтрэх
              </M.Button>
            </M.Stack>
          </M.Container>
        </M.Fade>
      )}
    </M.Box>
  );
};
