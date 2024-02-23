export const dynamic = 'force-dynamic';

import { executeQuery } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const deparments = (await executeQuery(
    'SELECT * FROM parent_department'
  )) as any;
  const children = (await executeQuery(
    'SELECT child.*, ROUND(IFNULL((SELECT SUM(value) FROM points WHERE departmentId = child.id), 0),2) AS totalP, ROUND(IFNULL((SELECT AVG(value) FROM manager_points WHERE departmentId = child.id), 0),2) AS avgMP FROM child_department AS child'
  )) as any;

  deparments.map((p: any) => {
    const filteredChildren = children.filter((c: any) => c.parentId === p.id);
    p.children = filteredChildren;
    let total = 0;
    filteredChildren.map((c: any) => (total += Number(c.totalP)+ Number(c.avgMP)));
    console.log(total);
    p.avg = (total / filteredChildren.length).toFixed(2);
  });

  deparments.push({
    id: 0,
    name: 'Гүйцэтгэх захирлын шууд удирдлагад',
    children: children.filter((c: any) => !c.parentId),
  });

  return NextResponse.json(deparments);
};
