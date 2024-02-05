'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import Image from 'next/image';
import { Logo } from '.';

export default () => {
  const { data: session, status } = useSession() as any;
  const trigger = M.useScrollTrigger();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleBackToTop = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');
    if (anchor) anchor.scrollIntoView({ block: 'center' });
  };

  return (
    <>
      <M.Slide in={!trigger} direction="down">
        <M.AppBar sx={{ backgroundColor: 'background.paper' }}>
          <M.Toolbar sx={{ justifyContent: 'space-between' }}>
            <M.Button href="/">
              <Logo size="small" />
            </M.Button>
            {status === 'loading' ? (
              <M.CircularProgress size={24} />
            ) : status === 'unauthenticated' ? (
              <M.Button startIcon={<I.Login />} href="/login">
                Нэвтрэх
              </M.Button>
            ) : (
              <>
                <M.Button
                  sx={{ color: 'text.primary' }}
                  startIcon={
                    session?.user?.image ? (
                      <M.Avatar
                        src={session?.user?.image}
                        sx={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <Image
                        src="/logo-icon.svg"
                        alt="logo"
                        width={20}
                        height={27}
                        priority
                        style={{
                          filter:
                            'invert(68%) sepia(42%) saturate(2131%) hue-rotate(346deg) brightness(100%) contrast(90%)',
                        }}
                        className="icon"
                      />
                    )
                  }
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <M.Typography
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    children={session?.user?.name}
                  />
                </M.Button>
                <M.Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { mt: 1 } }}
                  onClick={() => setAnchorEl(null)}
                  onClose={() => setAnchorEl(null)}
                >
                  {session?.user?.permision !== 'manager' && (
                    <M.MenuItem component={Link} href="/reports">
                      <M.ListItemIcon>
                        <I.DashboardOutlined />
                      </M.ListItemIcon>
                      <M.ListItemText>Хянах самбар</M.ListItemText>
                    </M.MenuItem>
                  )}
                  <M.MenuItem onClick={() => signOut()}>
                    <M.ListItemIcon>
                      <I.Logout />
                    </M.ListItemIcon>
                    <M.ListItemText>Системээс гарах</M.ListItemText>
                  </M.MenuItem>
                </M.Menu>
              </>
            )}
          </M.Toolbar>
        </M.AppBar>
      </M.Slide>
      <M.Toolbar id="back-to-top-anchor" />
      <M.Fade in={trigger}>
        <M.Box
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}
          role="presentation"
          onClick={handleBackToTop}
        >
          <M.Fab size="small" aria-label="scroll back to top" color="primary">
            <I.KeyboardArrowUp sx={{ color: 'whitesmoke' }} />
          </M.Fab>
        </M.Box>
      </M.Fade>
    </>
  );
};
