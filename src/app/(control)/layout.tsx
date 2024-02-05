'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as M from '@mui/material';
import { Logo } from '@/components';
import { Sidebar } from '@/components/control';

export default ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading')
    return (
      <M.Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <M.Box
          sx={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        >
          <Logo size="large" />
        </M.Box>
      </M.Box>
    );

  if (status === 'unauthenticated')
    router.push(`/login?callbackUrl=${pathname}`);

  return (
    <M.Box
      sx={{
        height: '100vh',
        display: 'flex',
        padding: 2,
      }}
    >
      <Sidebar />
      <M.Box
        sx={{
          paddingLeft: 2,
          flex: 1,
          height: '100%',
          // overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {children}
      </M.Box>
    </M.Box>
  );
};
