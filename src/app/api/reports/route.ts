export const dynamic = 'force-dynamic';

import { executeQuery } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { name } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );

  const reports = (await executeQuery(
    `SELECT * FROM reports${name ? ` WHERE name LIKE '%${name}%'` : ''}`
  )) as any[];
  const ids = reports.map((r) => r.id);

  const questions = (await executeQuery(
    `SELECT * FROM questions${
      name && reports.length > 0 ? ` WHERE id IN (${ids.join(',')})` : ''
    }`
  )) as any[];

  reports.map((r) => (r.points = questions.filter((q) => q.reportId === r.id)));

  return NextResponse.json(reports);
};

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const { name, managerPoint } = Object.fromEntries(
      formData.entries()
    ) as any;
    const pointNames = formData.getAll('pointName');
    const points = formData.getAll('point') as any;

    if (!name)
      return NextResponse.json(
        { message: [!name && 'Тайлангийн нэрийг бөглөх шаардлагатай.'] },
        { status: 422 }
      );

    // if (
    //   Number(managerPoint) +
    //     Number(
    //       points.length > 1
    //         ? points.reduce((a: string, b: string) => Number(a) + Number(b))
    //         : points[0]
    //     ) !==
    //   100
    // )
    //   return NextResponse.json(
    //     { message: ['Тайлангийн нийт оноо 100 байх ёстой!'] },
    //     { status: 406 }
    //   );

    const { insertId } = (await executeQuery(
      `INSERT INTO reports (name, managerPoint) VALUES (?, ?)`,
      [name, managerPoint]
    )) as any;

    await executeQuery(
      `INSERT INTO questions (name, point, reportId) VALUES ${pointNames
        .map((n, i) => `('${n}', ${points[i]}, ${insertId})`)
        .join(', ')}`
    );

    return NextResponse.json({ message: ['Ажилттай хадгалагдлаа.'] });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: ['Серверт алдаа гарлаа. Админд хандана уу1'] },
      { status: 500 }
    );
  }
};
