'use client';

import * as M from '@mui/material';
import { Form, Headbar } from '@/components/control';
import { Searchbar } from '@/components';
import * as I from '@mui/icons-material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';

const Title = ({
  children,
  action,
}: {
  children: string;
  action?: () => void;
}) => (
  <M.Box position="relative" width="100%">
    <M.Typography
      variant="h5"
      textTransform="uppercase"
      sx={{
        position: 'relative',
        backgroundColor: 'text.primary',
        color: 'background.paper',
        paddingLeft: 5,
        paddingY: 1,
        '&:before': {
          content: '""',
          position: 'absolute',
          display: 'block',
          left: 16,
          top: '50%',
          width: 15,
          height: '2px',
          transform: 'translateY(-50%)',
          backgroundColor: 'primary.main',
        },
      }}
      children={children}
    />
    <M.IconButton
      sx={{
        position: 'absolute',
        top: '50%',
        right: 8,
        transform: 'translateY(-50%)',
        color: 'background.paper',
        '&:hover': { color: 'primary.main' },
      }}
      onClick={action}
    >
      <I.AddCircleOutline />
    </M.IconButton>
  </M.Box>
);

const DepartmentListItem = ({
  data,
  dense,
  order,
  onClick,
}: {
  data: any;
  dense?: true | false;
  order: Number;
  onClick: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );
  const value = searchParams.get('parent');

  return (
    <M.Slide in direction="up" timeout={(Number(order) + 1) * 500}>
      <M.ListItem
        disablePadding
        dense={Boolean(dense)}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(241, 153, 33, 0.4)',
            '& .MuiAvatar-root': { backgroundColor: 'primary.main' },
          },
          ...(!dense &&
            data.id === Number(value) && {
              backgroundColor: 'rgba(241, 153, 33, 0.08) !important',
            }),
        }}
      >
        <M.ListItemButton onClick={onClick}>
          <M.ListItemText
            primary={data.name}
            primaryTypographyProps={{ fontWeight: 700 }}
            secondary={data.managerName}
          />
        </M.ListItemButton>
        {data.subLenght > 0 && (
          <M.ListItemIcon
            sx={{ minWidth: 'unset', marginX: 2, cursor: 'pointer' }}
            onClick={() => {
              if (data.id !== Number(value))
                newSearchParams.set('parent', data.id.toString());
              else newSearchParams.delete('parent');
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
          >
            <M.Tooltip title="Хэлтэс">
              <M.Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 16,
                  ...(data.id === Number(value) && {
                    backgroundColor: 'primary.main',
                  }),
                }}
                children={
                  data.id === Number(value) ? (
                    <I.Check fontSize="small" />
                  ) : (
                    data.subLenght
                  )
                }
              />
            </M.Tooltip>
          </M.ListItemIcon>
        )}
      </M.ListItem>
    </M.Slide>
  );
};

const DepartmentList = ({
  data,
  isLoading,
  variant,
  select,
}: {
  data: any;
  isLoading: boolean;
  variant: 'parent' | 'child';
  select: Function;
}) => {
  return (
    <M.Stack flex={{ md: 1 }} overflow={{ md: 'auto' }} gap={2}>
      <Title
        action={() =>
          select({ name: '', managerName: '', managerImage: '', variant })
        }
      >
        {variant === 'parent' ? 'Газар' : 'Хэлтэс'}
      </Title>
      {variant === 'child' && <Searchbar search="name" />}
      {isLoading ? (
        <M.CircularProgress sx={{ marginX: 'auto' }} />
      ) : data.length < 1 ? (
        <M.Typography variant="body2">Мэдээлэл олдсонгүй.</M.Typography>
      ) : (
        <M.List
          sx={{
            '&>*:nth-of-type(odd)': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              boxShadow: 1,
            },
          }}
        >
          {data.map((d: any, index: Number) => (
            <DepartmentListItem
              key={d.id}
              data={d}
              order={index}
              dense={variant === 'child'}
              onClick={() => select(d)}
            />
          ))}
        </M.List>
      )}
    </M.Stack>
  );
};

const DepartmentForm = ({
  data,
  handleClose,
}: {
  data: any;
  handleClose: () => void;
}) => {
  const [editable, setEdit] = useState(!data.id);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<any>();
  const { data: parents } = useSWR('/api/departments/parent', fetcher);

  const variant = data.variant
    ? data.variant
    : typeof data.parentId === 'number'
    ? 'child'
    : 'parent';

  return (
    <Form
      open={Boolean(data)}
      onClose={() => !editable && handleClose()}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as any);

        const response = await fetch(
          `/api/departments/${variant}/${data?.id ?? ''}`,
          { method: data?.id ? 'PUT' : 'POST', body: formData }
        );

        const { message } = await response.json();

        message.map(
          (m: string) =>
            m &&
            enqueueSnackbar({
              message: m,
              variant: response.ok ? 'success' : 'error',
            })
        );

        if (response.ok) handleClose();
      }}
    >
      <M.DialogTitle
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
        }}
      >
        <M.TextField
          label="Нэр"
          name="name"
          defaultValue={data.name}
          disabled={!editable}
          fullWidth
        />
        {data.id && (
          <M.FormControlLabel
            control={
              <M.Switch
                checked={editable}
                onChange={() => setEdit(!editable)}
              />
            }
            label="Засах"
          />
        )}
      </M.DialogTitle>
      <M.Divider variant="middle" />
      <M.DialogContent>
        <M.Stack
          gap={4}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
        >
          <M.IconButton component="label" disabled={!editable}>
            <M.Avatar
              src={
                file !== null ? URL.createObjectURL(file) : data.managerImage
              }
              sx={{ width: 150, height: 150, marginX: 'auto', boxShadow: 1 }}
            />
            <input
              type="file"
              name="file"
              ref={fileRef}
              accept="image/png, image/gif, image/jpeg"
              style={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              onChange={({ target }) =>
                target.files && setFile(target.files[0])
              }
            />
          </M.IconButton>
          <M.Stack flex={1} gap={2}>
            <M.TextField
              label="Дарга"
              name="managerName"
              defaultValue={data.managerName}
              disabled={!editable}
              fullWidth
            />
            {variant === 'child' && parents && (
              <M.FormControl fullWidth disabled={!editable}>
                <M.InputLabel children="Газар" />
                <M.Select
                  label="Газар"
                  name="parentId"
                  defaultValue={data?.parentId ?? 0}
                >
                  <M.MenuItem value={0}>
                    Гүйцэтгэх захирлын шууд удирдлагад
                  </M.MenuItem>
                  {parents.map((p: any) => (
                    <M.MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </M.MenuItem>
                  ))}
                </M.Select>
              </M.FormControl>
            )}
          </M.Stack>
        </M.Stack>
      </M.DialogContent>
      {editable && (
        <>
          <M.Divider variant="middle" sx={{ marginBottom: 2 }} />
          <M.DialogActions sx={{ paddingX: 3, gap: 3 }}>
            {data.id && (
              <M.Button
                variant="contained"
                color="error"
                startIcon={<I.Delete />}
                onClick={async () => {
                  const response = await fetch(
                    `/api/departments/${variant}/${data.id}`,
                    { method: 'DELETE' }
                  );
                  const { message } = await response.json();
                  message.map((m: string) =>
                    enqueueSnackbar({
                      message: m,
                      variant: response.ok ? 'success' : 'error',
                    })
                  );
                  if (response.ok) handleClose();
                }}
              >
                Устгах
              </M.Button>
            )}
            <M.Box flex={1} />
            <M.Button
              startIcon={<I.Clear />}
              onClick={() => {
                setEdit(false);
                handleClose();
              }}
            >
              Цуцлах
            </M.Button>
            <M.Button type="submit" variant="contained" startIcon={<I.Save />}>
              Хадгалах
            </M.Button>
          </M.DialogActions>
        </>
      )}
    </Form>
  );
};

export default () => {
  const searchParams = useSearchParams();
  const {
    data: parent,
    isLoading: isLoadingParent,
    mutate: mutateParent,
  } = useSWR('/api/departments/parent', fetcher);
  const {
    data: child,
    isLoading: isLoadingChild,
    mutate: mutateChild,
  } = useSWR(`/api/departments/child?${searchParams.toString()}`, fetcher);

  const [selected, select] = useState<any>(null);

  const { breakpoints } = M.useTheme();

  return (
    <>
      <Headbar title="Бүтэц" />
      <M.Stack
        component={M.Paper}
        width="100%"
        height="100%"
        maxHeight="calc(100vh - 112px)"
        elevation={4}
        direction={{ xs: 'column', md: 'row' }}
        gap={{ xs: 2, md: 4, xl: 8 }}
        padding={{ xs: 2, md: 4, xl: 8 }}
        overflow={{ xs: 'auto' }}
        divider={
          <M.Divider
            orientation={
              M.useMediaQuery(breakpoints.down('md'))
                ? 'horizontal'
                : 'vertical'
            }
            flexItem
          />
        }
      >
        <DepartmentList
          data={parent}
          variant="parent"
          isLoading={isLoadingParent}
          select={select}
        />
        <DepartmentList
          data={child}
          variant="child"
          isLoading={isLoadingChild}
          select={select}
        />
      </M.Stack>
      {selected && (
        <DepartmentForm
          data={selected}
          handleClose={() => {
            select(null);
            mutateParent();
            mutateChild();
          }}
        />
      )}
    </>
  );
};
