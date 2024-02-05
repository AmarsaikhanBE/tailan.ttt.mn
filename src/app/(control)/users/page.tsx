'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import useSWR from 'swr';
import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import { fetcher } from '@/lib/swr';
import { User } from '@/types';
import { Searchbar } from '@/components';
import { Form, Headbar } from '@/components/control';
import { useSession } from 'next-auth/react';

const UserListHead = () => (
  <M.Stack
    direction="row"
    divider={
      <M.Divider
        orientation="vertical"
        flexItem
        sx={{ backgroundColor: 'background.paper' }}
      />
    }
    sx={{
      backgroundColor: 'text.primary',
      borderRadius: 1,
      paddingY: 1,
      '& .MuiTypography-root': {
        fontWeight: 700,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: 'background.paper',
      },
    }}
  >
    <M.Typography minWidth={64} display={{ xs: 'none', sm: 'block' }}>
      Зураг
    </M.Typography>
    <M.Typography flex="1" minWidth={150}>
      Хувийн мэдэээлэл
    </M.Typography>
    <M.Typography
      flex="0.5"
      minWidth={75}
      display={{ xs: 'none', md: 'block' }}
    >
      Нэвтрэх нэр
    </M.Typography>
    <M.Typography minWidth={64}>Төлөв</M.Typography>
  </M.Stack>
);

const UserListItem = ({
  data,
  onClick,
}: {
  data: any;
  onClick: () => void;
}) => (
  <M.Stack
    direction="row"
    alignItems="center"
    divider={<M.Divider orientation="vertical" flexItem />}
    sx={{
      cursor: 'pointer',
      '&:hover': { backgroundColor: 'action.hover' },
    }}
    onClick={onClick}
  >
    <M.Box
      sx={{
        width: 64,
        padding: 1.5,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <M.Avatar src={data?.image ?? null} />
    </M.Box>
    <M.Box
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
        minWidth: 150,
      }}
    >
      <M.Typography noWrap variant="body1" paddingX={1.5}>
        {data.name}
      </M.Typography>
      <M.Typography noWrap variant="caption" paddingX={1.5}>
        {data.position}
      </M.Typography>
    </M.Box>
    <M.Box
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 0.5,
        minWidth: 75,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <M.Typography noWrap variant="body2" textAlign="center">
        {data.username}
      </M.Typography>
    </M.Box>
    <M.Box sx={{ width: 64, paddingX: 1.5 }}>
      <M.Switch size="small" disabled checked={!!data.active} />
    </M.Box>
  </M.Stack>
);

const UserForm = ({ data, handleClose, role }: any) => {
  const [editable, setEdit] = useState(!data.id);
  const [resetPassword, setResetPassword] = useState(!data.id);
  const [enableCheck, setCheck] = useState(data.permision === 'manager');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<any>();

  return (
    <Form
      open={Boolean(data)}
      onClose={() => !editable && handleClose()}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as any);

        if (data.id && resetPassword) formData.append('changePassword', 'on');

        const response = await fetch(`/api/users/${data?.id ?? ''}`, {
          method: data?.id ? 'PUT' : 'POST',
          body: formData,
        });

        const { message } = await response.json();

        message.map(
          (m: string) =>
            m &&
            enqueueSnackbar({
              message: m,
              variant: response.ok ? 'success' : 'error',
            })
        );

        if (response.ok) {
          setResetPassword(false);
          setEdit(false);
          handleClose();
        }
      }}
    >
      <M.DialogContent
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
        }}
      >
        <M.Stack
          gap={2}
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <M.TextField
            label="Овог нэр"
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
                  onChange={() => {
                    setResetPassword(false);
                    setEdit(!editable);
                  }}
                />
              }
              label="Засах"
            />
          )}
        </M.Stack>
        <M.Divider variant="middle" />
        <M.Stack gap={4} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
          <M.IconButton component="label" disabled={!editable}>
            <M.Avatar
              src={file !== null ? URL.createObjectURL(file) : data.image}
              sx={{ width: 250, height: 250, marginX: 'auto', boxShadow: 1 }}
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
              label="Албан тушаал"
              name="position"
              defaultValue={data.position}
              disabled={!editable}
              fullWidth
            />
            <M.TextField
              label="Нэвтрэх нэр"
              name="username"
              defaultValue={data.username}
              disabled={!editable}
              fullWidth
            />
            <M.FormControl fullWidth disabled={!editable}>
              <M.InputLabel>Хандалтын эрх</M.InputLabel>
              <M.Select
                label="Хандалтын эрх"
                name="permision"
                defaultValue={data?.permision ?? 'manager'}
                onChange={(event) => setCheck(event.target.value === 'manager')}
              >
                <M.MenuItem value="manager">Удирдлага</M.MenuItem>
                <M.MenuItem value="specialist">Мэргэжилтэн</M.MenuItem>
                <M.MenuItem value="admin">Administrator</M.MenuItem>
              </M.Select>
            </M.FormControl>
            <M.Stack direction="row" justifyContent="space-between">
              {enableCheck && (
                <M.FormControlLabel
                  name="active"
                  control={
                    <M.Switch size="small" defaultChecked={!!data.active} />
                  }
                  label="Үнэлгээ өгөх эрх"
                  disabled={!editable}
                />
              )}
              {data.id && editable && (
                <M.FormControlLabel
                  control={
                    <M.Switch
                      size="small"
                      checked={resetPassword}
                      onChange={() => setResetPassword(!resetPassword)}
                    />
                  }
                  label="Нууц үг солих"
                  disabled={!editable}
                />
              )}
            </M.Stack>
          </M.Stack>
        </M.Stack>
        {resetPassword && (
          <>
            <M.Divider variant="middle">
              {data.id && 'Нууц үг сэргээх'}
            </M.Divider>

            <M.Stack gap={2}>
              {data.id && role !== 'admin' && (
                <M.TextField
                  label="Хуучин нууц үг"
                  name="oldPassword"
                  type="password"
                  fullWidth
                />
              )}
              <M.TextField
                label="Шинэ нууц үг"
                name="newPassword"
                type="password"
                fullWidth
              />
              {data.id && role !== 'admin' && (
                <M.TextField
                  label="Баталгаажуулах"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  helperText="Шинэ нууц үгийг давтан оруулна уу!"
                />
              )}
            </M.Stack>
          </>
        )}
      </M.DialogContent>
      {editable && (
        <>
          <M.Divider variant="middle" sx={{ marginBottom: 2 }} />
          <M.DialogActions sx={{ paddingX: 3, gap: 3 }}>
            {data.id && role === 'admin' && (
              <M.Button
                variant="contained"
                color="error"
                startIcon={<I.Delete />}
                onClick={async () => {
                  const response = await fetch('/api/users/' + data.id, {
                    method: 'DELETE',
                  });
                  const { message } = await response.json();
                  message.map((m: string) =>
                    enqueueSnackbar({
                      message: m,
                      variant: response.ok ? 'success' : 'error',
                    })
                  );
                  if (response.ok) {
                    setResetPassword(false);
                    setEdit(false);
                    handleClose();
                  }
                }}
              >
                Устгах
              </M.Button>
            )}
            <M.Box flex={1} />
            <M.Button
              startIcon={<I.Clear />}
              onClick={() => {
                setResetPassword(false);
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
  const { data: session } = useSession() as any;
  const searchParams = useSearchParams();
  const { data, isLoading, mutate } = useSWR(
    `/api/users?${searchParams.toString()}`,
    fetcher
  );
  const [selected, select] = useState<any | null>(null);

  return (
    <>
      <Headbar
        title="Хэрэглэгч"
        action={() =>
          select({
            name: '',
            username: '',
            posision: '',
            permision: 'manager',
            image: '',
            active: false,
          })
        }
      />
      <M.Paper
        elevation={4}
        sx={{
          width: '100%',
          height: '100%',
          padding: { xs: 2, md: 4, xl: 8 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 4, xl: 8 },
          overflowY: 'auto',
        }}
      >
        <Searchbar
          search="name"
          helperText="Зөвхөн хэрэглэгчийн нэрээр хайх боломжтой!"
        />
        <M.Box sx={{ overflowX: 'auto' }}>
          <UserListHead />
          <M.List>
            {isLoading ? (
              <M.Stack height={400} alignItems="center" justifyContent="center">
                <M.CircularProgress />
              </M.Stack>
            ) : data?.length ? (
              data.map((user: User) => (
                <UserListItem
                  key={user.id}
                  data={user}
                  onClick={() => select(user)}
                />
              ))
            ) : (
              <M.Stack height={400} alignItems="center" justifyContent="center">
                <M.Typography>Мэдээлэл олдсонгүй.</M.Typography>
              </M.Stack>
            )}
          </M.List>
        </M.Box>
      </M.Paper>
      {selected && (
        <UserForm
          data={selected}
          role={session.user.permision}
          handleClose={() => {
            select(null);
            mutate();
          }}
        />
      )}
    </>
  );
};
