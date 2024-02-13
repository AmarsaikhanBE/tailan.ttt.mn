'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Rubik_Marker_Hatch } from 'next/font/google';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import * as M from '@mui/material';
import * as I from '@mui/icons-material';
import { Logo } from '@/components';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';

const font = Rubik_Marker_Hatch({ weight: '400', subsets: ['latin'] });

const Point = ({ name, max, defaultValue, changed }: any) => {
  const [value, setValue] = useState(defaultValue ?? 0);
  return (
    <M.Box sx={{ width: 200, paddingX: 4 }}>
      <M.Typography
        variant="h4"
        textAlign="center"
        className={font.className}
        // fontFamily="'__Rubik_Marker_Hatch_bbb79a', '__Rubik_Marker_Hatch_Fallback_bbb79a' !important"
        children={value}
      />
      <M.Slider
        name={name}
        max={max}
        defaultValue={defaultValue}
        color="info"
        sx={{ marginTop: 1 }}
        onChange={(event: any) => {
          setValue(event.target.value);
          changed(true);
        }}
      />
    </M.Box>
  );
};

const ReportData = ({
  reportId,
  departmentId,
  managerPoint,
  mutate,
}: {
  reportId: string;
  departmentId: string;
  managerPoint: string;
  mutate: () => void;
}) => {
  const { data, isLoading } = useSWR(
    `/api/points?reportId=${reportId}&departmentId=${departmentId}`,
    fetcher
  ) as any;

  const { data: session, status } = useSession() as any;

  const [changed, setChange] = useState<boolean>(false);

  return (
    <M.Stack
      gap={2}
      paddingY={2}
      component="form"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch(
          `/api/points?reportId=${reportId}&departmentId=${departmentId}`,
          { method: 'POST', body: formData }
        );

        const { message } = await response.json();
        message.map(
          (m: any) =>
            m &&
            enqueueSnackbar({
              message: m,
              variant: response.ok ? 'success' : 'error',
            })
        );

        if (response.ok) {
          setChange(false);
          mutate();
        }
      }}
    >
      {isLoading || status === 'loading' ? (
        <M.CircularProgress sx={{ marginY: 8, marginX: 'auto' }} />
      ) : (
        <>
          {data?.questions.map((question: any) => (
            <M.Stack
              key={question.id}
              direction={{ sm: 'row' }}
              gap={2}
              alignItems="center"
            >
              <M.Typography
                variant="h5"
                children={question.name}
                flex={1}
                width="100%"
                textAlign="start"
                paddingLeft={{ sm: 4 }}
              />
              {session?.user?.permision === 'specialist' ||
              session?.user?.permision === 'admin' ? (
                <>
                  <Point
                    changed={setChange}
                    name="pointValue"
                    max={question.point}
                    defaultValue={question.value?.value}
                  />
                  <input
                    name="questionId"
                    value={question.id}
                    readOnly
                    style={{ display: 'none' }}
                  />
                  <input
                    name="valueId"
                    value={question.value?.id}
                    readOnly
                    style={{ display: 'none' }}
                  />
                </>
              ) : (
                <M.Typography
                  variant="h4"
                  textAlign="center"
                  width={200}
                  className={font.className}
                  children={question.value?.value || 0}
                />
              )}
            </M.Stack>
          ))}
          <M.Divider variant="middle" children="Удирдлагын үнэлгээ" />
          {session?.user.permision === 'manager' && (
            <M.Stack direction={{ sm: 'row' }} alignItems="center">
              <M.ListItem>
                <M.ListItemIcon>
                  <M.Avatar
                    src={session?.user?.image || undefined}
                    sx={{ width: 100, height: 100, boxShadow: 1 }}
                  />
                </M.ListItemIcon>
                <M.ListItemText
                  primary={session?.user?.name}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: { sm: '2.125rem' },
                  }}
                  secondary={session.user.position || undefined}
                  secondaryTypographyProps={{ color: 'primary.main' }}
                  sx={{ paddingLeft: 2 }}
                />
              </M.ListItem>
              <input
                name="mpId"
                value={
                  data.mpValues?.filter(
                    (v: any) => v?.userId === session?.user?.id
                  )[0]?.id || ''
                }
                readOnly
                style={{ display: 'none' }}
              />
              <Point
                changed={setChange}
                name="mpValue"
                max={Number(managerPoint)}
                defaultValue={
                  data.mpValues?.filter(
                    (v: any) => v?.userId === session?.user?.id
                  )[0]?.value || 0
                }
              />
            </M.Stack>
          )}
          {data?.mpValues.map(
            (v: any) =>
              v.userId !== session?.user?.id && (
                <M.Stack
                  key={v.id}
                  direction={{ sm: 'row' }}
                  alignItems="center"
                >
                  <M.ListItem>
                    <M.ListItemIcon>
                      <M.Avatar
                        src={v.userImage}
                        sx={{ width: 100, height: 100, boxShadow: 1 }}
                      />
                    </M.ListItemIcon>
                    <M.ListItemText
                      primary={v.userName}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: { sm: '2.125rem' },
                      }}
                      secondary={v.userPosition}
                      secondaryTypographyProps={{ color: 'primary.main' }}
                      sx={{ paddingLeft: 2 }}
                    />
                  </M.ListItem>
                  {session?.user?.permision === 'admin' ? (
                    <>
                      <input
                        name="mpId"
                        value={v.id}
                        readOnly
                        style={{ display: 'none' }}
                      />
                      <Point
                        changed={setChange}
                        name="mpValue"
                        max={Number(managerPoint)}
                        defaultValue={v.value}
                      />
                    </>
                  ) : (
                    <M.Typography
                      variant="h3"
                      textAlign="center"
                      width={200}
                      className={font.className}
                      children={v.value}
                    />
                  )}
                </M.Stack>
              )
          )}
        </>
      )}
      {changed && (
        <M.Button
          type="submit"
          variant="contained"
          color="info"
          children="Хадгалах"
        />
      )}
    </M.Stack>
  );
};

export default () => {
  const { departmentId, reportId, managerPoint } = Object.fromEntries(
    useSearchParams().entries()
  );
  const { data, isLoading, mutate } = useSWR(
    `/api/departments/child/${departmentId}?reportId=${reportId}`,
    fetcher
  );

  return (
    <M.Stack
      alignItems="center"
      justifyContent="center"
      minHeight={{ xs: 'calc(100vh - 3.5rem)', md: 'calc(100vh - 4rem)' }}
      width="100%"
    >
      {isLoading ? (
        <M.Box
          sx={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        >
          <Logo size="large" />
        </M.Box>
      ) : data ? (
        <M.Container maxWidth="xl">
          <M.Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <M.Box flex={1}>
              <M.Typography
                variant="h4"
                fontSize={{ sm: '3rem' }}
                fontWeight={700}
                textTransform="uppercase"
                color="primary.main"
                children={data.name}
              />
              <M.Stack direction="row" gap={2} alignItems="center">
                <M.Avatar
                  src={data.managerImage}
                  sx={{ width: 64, height: 64 }}
                />
                <M.Typography variant="h6" fontSize={{ sm: '2rem' }}>
                  {data.managerName}
                </M.Typography>
              </M.Stack>
            </M.Box>
            <M.Box
              sx={{
                width: 200,
                height: 200,
                position: 'relative',
              }}
            >
              <M.Typography
                variant="body2"
                color="primary.main"
                sx={{
                  position: 'absolute',
                  bottom: 32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                children="Нийт оноо"
              />
              <M.Typography
                variant="h1"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className={font.className}
                children={data.total}
              />
            </M.Box>
          </M.Stack>
          <M.Divider
            variant="middle"
            sx={{ textTransform: 'capitalize' }}
            children="Шалгуур үзүүлэлтүүд"
          />
          <ReportData
            reportId={reportId}
            departmentId={departmentId}
            managerPoint={managerPoint}
            mutate={mutate}
          />
        </M.Container>
      ) : (
        <>
          <M.Typography variant="body2" sx={{ marginY: 4 }}>
            Мэдээлэл олдсонгүй.
          </M.Typography>
          <M.Button variant="contained" href="/" startIcon={<I.ArrowBack />}>
            Буцах
          </M.Button>
        </>
      )}
    </M.Stack>
  );
};
