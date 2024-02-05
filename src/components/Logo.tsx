import Image from 'next/image';
import * as M from '@mui/material';

export default ({
  size,
  hiddenText,
}: {
  size?: 'small' | 'medium' | 'large';
  hiddenText?: boolean;
}) => (
  <M.Box
    sx={{
      display: 'flex',
      gap: size === 'small' ? '6px' : size === 'large' ? '12px' : '8px',
    }}
    className="logo"
  >
    <M.Box
      sx={{
        position: 'relative',
        width: size === 'small' ? 30 : size === 'large' ? 60 : 40,
        height: size === 'small' ? 40.5 : size === 'large' ? 81 : 54,
      }}
    >
      <Image
        src="/logo-icon.svg"
        alt="logo"
        fill
        style={{
          objectFit: 'contain',
          filter:
            'invert(68%) sepia(42%) saturate(2131%) hue-rotate(346deg) brightness(100%) contrast(90%)',
        }}
        className="icon"
      />
    </M.Box>
    <M.Box
      sx={{
        position: 'relative',
        width: size === 'small' ? 103.5 : size === 'large' ? 207 : 138,
        height: size === 'small' ? 26.25 : size === 'large' ? 52.5 : 35,
        alignSelf: 'end',
        marginBottom: size === 'small' ? 0.5 : size === 'large' ? 1 : 0.7,
        ...(hiddenText && { display: { xs: 'none', md: 'block' } }),
      }}
    >
      <Image
        src="/logo-text.svg"
        alt="logo"
        fill
        priority
        style={{ objectFit: 'contain' }}
      />
    </M.Box>
  </M.Box>
);
