'use client';

import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import { Form, Headbar } from '@/components/control';
import { Searchbar } from '@/components';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { useSearchParams } from 'next/navigation';

const PointSlider = ({
  label,
  name,
  max,
  defaultValue,
  fullWidth,
}: {
  label?: string;
  name: string;
  max?: number;
  defaultValue?: number;
  fullWidth?: boolean;
}) => {
  const [value, setValue] = useState<number>(defaultValue || 20);
  const maxValue = max ?? 100;

  return (
    <M.FormControlLabel
      control={
        <M.Stack direction="row" flex={1} sx={{ gap: 2, minWidth: '10rem' }}>
          <M.Slider
            name={name}
            value={value}
            max={maxValue}
            onChange={(event: Event, newValue: number | number[]) =>
              setValue(newValue as number)
            }
          />
          <M.Input
            value={value}
            onChange={(event) =>
              setValue(
                event.target.value === '' ? 0 : Number(event.target.value)
              )
            }
            onBlur={(event) => {
              if (Number(event.target.value) < 0) {
                setValue(0);
              } else if (Number(event.target.value) > maxValue) {
                setValue(maxValue);
              }
            }}
            inputProps={{
              //   step: 5,
              min: 0,
              max: maxValue,
              type: 'number',
            }}
          />
        </M.Stack>
      }
      label={label}
      sx={{
        width: fullWidth ? '100%' : 'fit-content',
        flexDirection: 'row-reverse',
        gap: 2,
        alignItems: 'center',
        marginX: 0,
      }}
    />
  );
};

const ReportForm = ({
  data,
  handleClose,
}: {
  data: any;
  handleClose: () => void;
}) => {
  const [points, setPoints] = useState<any>(
    data.points ?? [{ id: 0, name: '', point: 20 }]
  );

  return (
    <Form
      open={Boolean(data)}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as any);

        const response = await fetch(`/api/reports/${data.id ?? ''}`, {
          method: data.id ? 'PUT' : 'POST',
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

        if (response.ok) handleClose();
      }}
    >
      <M.DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <M.TextField
          label="Тайлангийн нэр"
          defaultValue={data.name}
          name="name"
          fullWidth
        />
        <PointSlider
          label="Удирдлагын оноо"
          name="managerPoint"
          max={50}
          defaultValue={data.managerPoint}
        />
        <M.Divider variant="middle">Шалгуур үзүүлэлтүүд</M.Divider>
        {points.map((point: any, index: number) => (
          <M.Stack
            key={index}
            direction="row"
            gap={2}
            sx={{
              ...(points.length > 1 && {
                '&:last-of-type .MuiIconButton-root': {
                  display: 'inline-flex',
                },
              }),
            }}
          >
            <M.Tooltip title="Хасах">
              <M.IconButton
                size="small"
                color="error"
                sx={{ width: 56, display: 'none' }}
                onClick={() => {
                  points.pop();
                  setPoints([...points]);
                }}
              >
                <I.Remove />
              </M.IconButton>
            </M.Tooltip>
            <M.Input name="pointId" value={point.id} sx={{ display: 'none' }} />
            <M.TextField
              label={'Шалгуур ' + (index + 1)}
              name={'pointName'}
              fullWidth
              defaultValue={point.name}
            />
            <PointSlider name={'point'} defaultValue={point.point} />
          </M.Stack>
        ))}
        <M.Button
          onClick={() => setPoints([...points, { id: 0, name: '', point: 20 }])}
          size="small"
          startIcon={<I.AddCircleOutline />}
        >
          Шалгуур нэмэх
        </M.Button>
      </M.DialogContent>
      <M.Divider variant="middle" sx={{ marginBottom: 2 }} />
      <M.DialogActions sx={{ paddingX: 3, gap: 3 }}>
        {data.id && (
          <M.Button
            variant="contained"
            color="error"
            startIcon={<I.Delete />}
            onClick={async () => {
              const response = await fetch('/api/reports/' + data.id, {
                method: 'DELETE',
              });
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
        <M.Button onClick={handleClose}>Цуцлах</M.Button>
        <M.Button type="submit" variant="contained">
          Хадгалах
        </M.Button>
      </M.DialogActions>
    </Form>
  );
};

export default () => {
  const searchParams = useSearchParams();
  const { data, isLoading, mutate } = useSWR(
    `/api/reports?${searchParams.toString()}`,
    fetcher
  );

  const [selected, select] = useState<any>(null);

  return (
    <>
      <Headbar title="Тайлан" action={() => select({ name: '' })} />
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
        <Searchbar search="name" />
        {isLoading ? (
          <M.CircularProgress sx={{ marginX: 'auto' }} />
        ) : data.length > 0 ? (
          <M.List
            sx={{
              '&>*:nth-of-type(odd)': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                boxShadow: 1,
                '& .MuiAvatar-root': { backgroundColor: 'background.paper' },
                '& .MuiAvatar-img': {
                  filter:
                    'invert(68%) sepia(42%) saturate(2131%) hue-rotate(346deg) brightness(100%) contrast(90%)',
                },
              },
              '&>*:nth-of-type(even)': {
                '& .MuiAvatar-root': { backgroundColor: 'primary.main' },
              },
            }}
          >
            {data.map((report: any, index: number) => (
              <M.Slide
                in
                key={report.id}
                direction="up"
                timeout={(index + 1) * 500}
              >
                <M.ListItem
                  disablePadding
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(241, 153, 33, 0.4)',
                    },
                  }}
                >
                  <M.ListItemButton onClick={() => select(report)}>
                    <M.ListItemIcon>
                      <M.Avatar
                        src="/logo-icon.svg"
                        sx={{
                          width: 32,
                          height: 32,
                          boxShadow: 1,
                          '& .MuiAvatar-img': {
                            width: 24,
                            height: 24,
                            objectFit: 'contain',
                            filter: 'invert(100%)',
                          },
                        }}
                      />
                    </M.ListItemIcon>
                    <M.ListItemText primary={report.name} />
                  </M.ListItemButton>
                </M.ListItem>
              </M.Slide>
            ))}
          </M.List>
        ) : (
          <M.Typography variant="body2">Мэдээлэл олдсонгүй</M.Typography>
        )}
      </M.Paper>
      {selected && (
        <ReportForm
          data={selected}
          handleClose={() => {
            select(null);
            mutate();
          }}
        />
      )}
    </>
  );
};
