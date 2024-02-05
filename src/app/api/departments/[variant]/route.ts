import { executeQuery } from '@/lib/mysql';
import upload from '@/lib/upload';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { variant: string } }
) => {
  const { name, parent } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );

  const departments = await executeQuery(
    `SELECT ${
      params.variant === 'parent'
        ? 'parent.id AS id, parent.name AS name, parent.managerName AS managerName,parent.managerImage AS managerImage, (SELECT COUNT(*) FROM child_department AS child WHERE child.parentId = parent.id) AS subLenght'
        : '*'
    } FROM ${params.variant}_department${
      params.variant === 'parent' ? ' AS parent' : ''
    }${
      params.variant === 'child'
        ? `${
            name || parent
              ? ` WHERE ${name ? `name LIKE '%${name}%'` : ''}${
                  name && parent ? ' AND ' : ''
                }${parent ? `parentID = ${parent}` : ''}`
              : ''
          } ORDER BY name ASC`
        : ''
    }`
  );

  return NextResponse.json(departments);
};

export const POST = async (
  request: NextRequest,
  { params }: { params: { variant: string } }
) => {
  try {
    const { name, managerName, file, parentId } = Object.fromEntries(
      (await request.formData()).entries() as any
    );

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
      `INSERT INTO ${params.variant}_department (name,${
        params.variant === 'child' ? ' parentId,' : ''
      }${image ? ' managerImage,' : ''} managerName) VALUES (?,${
        params.variant === 'child' ? ` '${parentId}',` : ''
      }${image ? ` '${image}',` : ''} ?)`,
      [name, managerName]
    );

    return NextResponse.json({ message: ['Ажилттай хадгалагдлаа.'] });
  } catch (error) {
    throw error;
  }
};
