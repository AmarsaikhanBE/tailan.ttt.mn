"use client"

import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import * as M from '@mui/material';

export default ({ params }: { params: { id: string } }) => {
	const { data, isLoading } = useSWR(`/api/reports/${params.id}`, fetcher);

	if (isLoading) return <M.CircularProgress />;
	if (!data) return <M.Typography variant='h5' children="Мэдээлэл олдсонгүй" />;


	return (<M.Container maxWidth="lg">
		<M.Typography variant="h3" children={data.name} />
		<M.Stack
			sx={{ gap: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', color: 'white', padding: 1 }}
			divider={<M.Divider variant="middle" orientation="vertical" flexItem sx={{ borderColor: 'white' }} />}
		>
			<M.Typography variant="h6" flex={1} display={{ xs: 'none', md: 'block' }} children="Нэгжийн нэр" />
			<M.Typography variant="h6" width={100} textAlign="center" lineHeight="normal" children="Шалгуур үзүүлэлт"/>
			<M.Typography variant="h6" width={130} textAlign="center" lineHeight="noraml" children="Удирдлагын оноо" />
			<M.Typography variant="h6" width={70} textAlign="center" lineHeight="normal" children="Нийт оноо" />
		</M.Stack>
		<M.Stack padding={1} gap={0.5} border={1}>
			{data.departments.map((department:any) => (
				<M.Stack key={department.name} direction={{ xs: 'column', md: 'row' }} alignItems="center" boxShadow={1} divider={<M.Divider variant="middle" flexItem orientation="vertical" />}>
					<M.Typography variant="body1" flex={1} paddingX={1} children={department.name} />
					<M.Stack direction="row" gap={1} padding={1} paddingRight={0} width={348} textAlign="center" divider={<M.Divider orientation="vertical" flexItem />}>
						<M.Typography variant="body2" width={100} children={department.points} />
						<M.Typography variant="body2" width={130} children={department.avgMP} />
						<M.Typography variant="body2" width={70} children={Number(department.points) + Number(department.avgMP)} />
					</M.Stack>
				</M.Stack>))
			}
		</M.Stack>
	</M.Container>);};
