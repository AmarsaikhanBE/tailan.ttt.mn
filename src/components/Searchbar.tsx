'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as M from '@mui/material';
import { Search } from '@mui/icons-material';

export default (props: M.TextFieldProps & { search: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  return (
    <M.Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        newSearchParams.set(
          props.search,
          (event.target as HTMLFormElement).search.value
        );
        router.push(`${pathname}?${newSearchParams.toString()}`);
      }}
    >
      <M.TextField
        {...props}
        name="search"
        fullWidth
        variant="filled"
        InputProps={{
          startAdornment: <Search />,
          endAdornment: (
            <M.Button size="small" type="submit">
              Хайх
            </M.Button>
          ),
        }}
        sx={{
          '& .MuiInputBase-root': { gap: 1 },
          '& .MuiInputBase-input': { paddingTop: 1 },
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            (event.target as HTMLInputElement).value = '';
            newSearchParams.delete(props.search);
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }
        }}
      />
    </M.Box>
  );
};
