'use client';

import { usePathname } from 'next/navigation';
import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import { Logo } from '..';

export default () => (
  <M.Paper
    elevation={4}
    sx={{
      width: { xs: 64, md: 256 },
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <M.Box sx={{ padding: '17px' }}>
      <Logo size="small" hiddenText />
    </M.Box>
    <M.Divider />
    <M.List
      sx={{
        '& .Mui-selected': { color: 'primary.main' },
        '& .Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
      }}
    >
      {/* <ListItem
        title="Хянах самбар"
        url="/dashboard"
        icon={<I.DashboardCustomizeOutlined />}
      />
      <M.Divider variant="middle" sx={{ marginY: 1 }} /> */}
      <ListItem title="Хэрэглэгч" url="/users" icon={<I.AccountCircle />} />
      <ListItem
        title="Бүтэц"
        url="/departments"
        icon={<I.AccountTreeOutlined />}
      />
      <M.Divider variant="middle" sx={{ marginY: 1 }} />
      <ListItem title="Тайлан" url="/reports" icon={<I.Equalizer />} />
    </M.List>
  </M.Paper>
);

const ListItem = ({
  title,
  url,
  icon,
}: {
  title: string;
  url: string;
  icon: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <M.ListItem
      disablePadding
      selected={pathname.startsWith(url)}
      sx={{
        '&:hover': {
          color: 'primary.main',
          '& .MuiListItemIcon-root': { color: 'primary.main' },
        },
        '& .MuiSvgIcon-root': { width: 40, height: 40 },
      }}
    >
      <M.ListItemButton href={url} sx={{ paddingX: 1.5 }}>
        <M.ListItemIcon>{icon}</M.ListItemIcon>
        <M.ListItemText sx={{ '& .MuiTypography-root': { fontWeight: 700 } }}>
          {title}
        </M.ListItemText>
      </M.ListItemButton>
    </M.ListItem>
  );
};
