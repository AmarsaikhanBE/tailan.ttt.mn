export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import upload from '@/lib/upload';
import { executeQuery } from '@/lib/mysql';
import { User } from '@/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const GET = async (request: NextRequest) => {
  const { user } = (await getServerSession(authOptions)) as any;
  const { name } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );

  let query =
    'SELECT id, name, position, username, permision, active, image FROM users';

  if (user.permision !== 'admin' || name) {
    query += ' WHERE';
    if (user.permision !== 'admin') query += " permision != 'admin'";
    if (user.permision !== 'admin' && name) query += ',';
    if (name) query += ` name LIKE '%${name}%'`;
  }

  const users = await executeQuery(query);

  return NextResponse.json(users);
};

export const POST = async (request: NextRequest) => {
  try {
    const { name, username, position, permision, active, file, newPassword } =
      Object.fromEntries((await request.formData()).entries()) as User & any;

    const image = await upload(file);
    const password = newPassword ? await bcrypt.hash(newPassword, 10) : null;

    if (!username || !password)
      return NextResponse.json(
        {
          message: [
            !username && 'Нэвтрэх нэрийг бөглөх шаардлагатай.',
            !password && 'Нууц үгийг бөглөх шаардлагатай.',
          ],
        },
        { status: 422 }
      );

    await executeQuery(
      'INSERT INTO users (username, password, permision, name, position, active, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, password, permision, name, position, Boolean(active), image]
    );

    return NextResponse.json({ message: ['Амжилттай хадгалагдлаа'] });
  } catch (error) {
    const err = JSON.parse(JSON.stringify(error));
    if (err.errno === 1062)
      return NextResponse.json(
        { message: ['Хэрэглэгчийн нэвтрэх нэр давхардсан.'] },
        { status: 406 }
      );

    throw new Error('Серверт алдаа гарлаа');
  }
};
