import { executeQuery } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const deparments = (await executeQuery(
    'SELECT * FROM parent_department'
  )) as any;
  const children = (await executeQuery(
    'SELECT * FROM child_department'
  )) as any;

  deparments.map(
    (p: any) => (p.children = children.filter((c: any) => c.parentId === p.id))
  );
  deparments.push({
    id: 0,
    name: 'Гүйцэтгэх захирлын шууд удирдлагад',
    children: children.filter((c: any) => !c.parentId),
  });

  return NextResponse.json(deparments);
};
