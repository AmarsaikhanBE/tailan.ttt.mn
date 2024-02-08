export const dynamic = 'force-dynamic';

import { executeQuery } from '@/lib/mysql';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const formData = await request.formData();

    const { name, managerPoint } = Object.fromEntries(
      formData.entries()
    ) as any;

    const pointIds = formData.getAll('pointId');
    const pointNames = formData.getAll('pointName');
    const points = formData.getAll('point') as any;

    if (!name)
      return NextResponse.json(
        { message: [!name && 'Тайлангийн нэрийг бөглөх шаардлагатай.'] },
        { status: 422 }
      );

    if (
      Number(managerPoint) +
        Number(
          points.length > 1
            ? points.reduce((a: string, b: string) => Number(a) + Number(b))
            : points[0]
        ) !==
      100
    )
      return NextResponse.json(
        { message: ['Тайлангийн нийт оноо 100 байх ёстой!'] },
        { status: 406 }
      );

    await executeQuery(
      'UPDATE reports SET name = ?, managerPoint = ? WHERE id = ?',
      [name, managerPoint, params.id]
    );

    await executeQuery(
      `DELETE FROM questions WHERE id NOT IN (${pointIds.join(
        ', '
      )}) AND reportId = ${params.id}`
    );

    await executeQuery(
      `DELETE FROM points WHERE questionId NOT IN (${pointIds.join(
        ', '
      )}) AND reportId = ${params.id}`
    );

    pointIds.map(
      async (id, i) =>
        await executeQuery(
          id === '0'
            ? 'INSERT INTO questions (name, point, reportId) VALUES (?, ?, ?)'
            : 'UPDATE questions SET name = ?, point = ? WHERE id = ?',
          [pointNames[i], points[i], id === '0' ? params.id : id]
        )
    );

    return NextResponse.json({ message: ['Ажилттай хадгалагдлаа.'] });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: ['Серверт алдаа гарлаа. Админд хандана уу!'] },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await executeQuery('DELETE FROM reports WHERE id = ?', [params.id]);
    await executeQuery('DELETE FROM questions WHERE reportId = ?', [params.id]);
    await executeQuery('DELETE FROM points WHERE reportId = ?', [params.id]);
    await executeQuery('DELETE FROM manager_points WHERE reportId = ?', [
      params.id,
    ]);

    return NextResponse.json({ message: ['Ажилттай устгагдлаа.'] });
  } catch (error) {
    return NextResponse.json(
      { message: ['Серверт алдаа гарлаа. Админд хандана уу!'] },
      { status: 500 }
    );
  }
};
