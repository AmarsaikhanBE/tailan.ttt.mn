export const dynamic = 'force-dynamic';

import { executeQuery } from '@/lib/mysql';
import upload from '@/lib/upload';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { variant: string; id: string } }
) => {
  const { reportId } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );

  const [deparment] = (await executeQuery(
    `SELECT *, (SELECT SUM(value) AS sum FROM points WHERE departmentId = ${params.id} AND reportId = ${reportId}) AS sumP, (SELECT AVG(value) FROM manager_points WHERE departmentId = ${params.id} AND reportId = ${reportId}) AS avgMP FROM ${params.variant}_department WHERE id = ?`,
    [params.id]
  )) as any;

  return NextResponse.json(deparment);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { variant: string; id: string } }
) => {
  try {
    const { name, managerName, file, parentId } = Object.fromEntries(
      (await request.formData()).entries()
    ) as any;

    if (!name || !managerName)
      return NextResponse.json(
        {
          message: [
            !name &&
              `${
                params.variant === 'parent' ? 'Газрын' : 'Хэлтсийн'
              } нэрийг бөглөх шаардлагатай.`,
            !managerName && 'Даргийн нэрийг бөглөх шаардлагатай.',
          ],
        },
        { status: 422 }
      );

    const image = await upload(file);

    await executeQuery(
      `UPDATE ${params.variant}_department SET name = ?,${
        image ? ` managerImage = '${image}',` : ''
      }${
        parentId ? ` parentId = ${parentId},` : ''
      } managerName = ? WHERE id = ?`,
      [name, managerName, params.id]
    );

    return NextResponse.json({ message: ['Амжилттай хадгалагдлаа.'] });
  } catch (error) {
    throw error;
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { variant: string; id: string } }
) => {
  try {
    await executeQuery(
      `DELETE FROM ${params.variant}_department WHERE id = ?`,
      [params.id]
    );

    return NextResponse.json({ message: ['Амжилттай устгагдлаа.'] });
  } catch (error) {
    return NextResponse.json(
      { message: ['Серверт алдаа гарлаа. Админд хандана уу!'] },
      { status: 500 }
    );
  }
};
