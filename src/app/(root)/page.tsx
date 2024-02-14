'use client';

import { Logo } from '@/components';
import { fetcher } from '@/lib/swr';
import * as M from '@mui/material';
import { Rubik_Marker_Hatch } from 'next/font/google';
import { useState } from 'react';
import useSWR from 'swr';

const font = Rubik_Marker_Hatch({ weight: '400', subsets: ['latin'] });

const Report = ({ value }: { value: any }) => {
  const { data, isLoading } = useSWR('/api/departments', fetcher);
  const [open, setOpen] = useState<boolean>(false);
  const [openSub, setOpenSub] = useState<number | null>(null);

  return (
    <M.Stack
      component="section"
      width="100%"
      direction="column-reverse"
      alignItems="center"
      justifyContent="center"
      minHeight={{ xs: 'calc(100vh - 3.5rem)', md: 'calc(100vh - 4rem)' }}
    >
      <M.Stack gap={4} paddingY={8} component={M.Container} maxWidth="xl">
        <M.Typography
          variant="h3"
          children={value.name}
          position="relative"
          sx={{
            marginX: 'auto',
            width: 'fit-content',
            borderBottom: 1,
            '&:before': {
              content: '""',
              position: 'absolute',
              right: 128,
              bottom: '100%',
              width: 56,
              height: 56,
              backgroundImage: 'url(/logo-icon.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: (theme) =>
                theme.palette.mode === 'light'
                  ? 'invert(68%) sepia(42%) saturate(2131%) hue-rotate(346deg) brightness(100%) contrast(90%)'
                  : 'invert(100%)',
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              right: 0,
              bottom: '100%',
              width: 128,
              height: 43,
              backgroundImage: 'url(/logo-text.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: (theme) =>
                theme.palette.mode === 'dark' ? 'invert(100%)' : 'invert(0)',
            },
          }}
        />
        <M.Collapse in={open} timeout={1000} mountOnEnter>
          {isLoading ? (
            <M.CircularProgress sx={{ marginX: 'auto', marginY: 5 }} />
          ) : data ? (
            <M.List>
              {data.map((parent: any, i: number) => (
                <M.ListItem
                  key={parent.id}
                  disablePadding
                  sx={{
                    flexDirection: 'column',
                    '&:nth-of-type(odd)>.MuiButtonBase-root': {
                      boxShadow: 1,
                      backgroundColor: 'background.paper',
                    },
                  }}
                >
                  <M.ListItemButton
                    sx={{ width: '100%' }}
                    onClick={() =>
                      setOpenSub(openSub === parent.id ? null : parent.id)
                    }
                  >
                    <M.ListItemText
                      primary={parent.name}
                      primaryTypographyProps={{
                        variant: 'h5',
                      }}
                      secondary={parent.managerName}
                      secondaryTypographyProps={{ color: 'primary.main' }}
                    />
                    {parent.avg > 0 && (
                      <M.ListItemIcon sx={{ color: 'info.main' }}>
                        <p
                          className={font.className}
                          style={{ fontSize: '1.75rem', margin: 0 }}
                          children={parent.avg + '%'}
                        />
                      </M.ListItemIcon>
                    )}
                  </M.ListItemButton>
                  <M.Collapse
                    in={openSub === parent.id}
                    mountOnEnter
                    sx={{ width: '100%' }}
                  >
                    {parent.children.map((child: any) => (
                      <M.ListItemButton
                        key={child.id}
                        dense
                        sx={{
                          paddingLeft: 4,
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          },
                        }}
                        href={`/tailan?reportId=${value.id}&departmentId=${child.id}&managerPoint=${value.managerPoint}`}
                      >
                        <M.ListItemText
                          primary={child.name}
                          secondary={child.managerName}
                        />
                        <M.ListItemIcon sx={{ color: 'info.main' }}>
                          <p
                            className={font.className}
                            style={{ margin: 0 }}
                            children={child.total + '%'}
                          />
                        </M.ListItemIcon>
                      </M.ListItemButton>
                    ))}
                  </M.Collapse>
                </M.ListItem>
              ))}
            </M.List>
          ) : (
            <M.Typography variant="body2" children="Мэдээлэл олдсонгүй." />
          )}
        </M.Collapse>
        <M.Button
          variant="contained"
          size="large"
          sx={{ marginX: 'auto', display: 'block' }}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Хаах' : 'Дэлгэрэнгүй'}
        </M.Button>
      </M.Stack>
    </M.Stack>
  );
};

export default () => {
  const { data, isLoading } = useSWR('/api/reports', fetcher);

  return isLoading ? (
    <M.Stack
      component="section"
      flex={1}
      direction="column-reverse"
      alignItems="center"
      justifyContent="center"
      minHeight={{ xs: 'calc(100vh - 3.5rem)', md: 'calc(100vh - 4rem)' }}
    >
      <M.Box
        sx={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      >
        <Logo size="large" />
      </M.Box>
    </M.Stack>
  ) : data ? (
    data.map((r: any, i: number) => <Report key={r.name} value={r} />)
  ) : (
    <M.Stack
      component="section"
      flex={1}
      direction="column-reverse"
      alignItems="center"
      justifyContent="center"
      minHeight={{ xs: 'calc(100vh - 3.5rem)', md: 'calc(100vh - 4rem)' }}
    >
      Тайлангийн систем тун удахгүй
    </M.Stack>
  );
};
