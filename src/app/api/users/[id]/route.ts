import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { executeQuery } from '@/lib/mysql';
import upload from '@/lib/upload';
import { User } from '@/types';

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { user } = (await getServerSession(authOptions)) as any;

  try {
    const {
      name,
      position,
      username,
      permision,
      active,
      oldPassword,
      newPassword,
      confirmPassword,
      changePassword,
      file,
    } = Object.fromEntries((await request.formData()).entries()) as User & any;

    if (!username)
      return NextResponse.json(
        { message: ['Нэвтрэх нэрийг бөглөх шаардлагатай.'] },
        { status: 422 }
      );

    const checkPassword = async () => {
      if (!!changePassword) {
        if (user.permision === 'admin') {
          if (!newPassword)
            return NextResponse.json(
              { message: ['Шинэ нууц үгийг бөглөх шаардлагатай.'] },
              { status: 422 }
            );
        } else {
          if (!oldPassword || !newPassword)
            return NextResponse.json(
              {
                message: [
                  !oldPassword && 'Хуучин нууц үгийг бөглөх шаардлагатай.',
                  !newPassword && 'Шинэ нууц үгийг бөглөх шаардлагатай.',
                ],
              },
              { status: 422 }
            );

          if (newPassword !== confirmPassword)
            return NextResponse.json(
              {
                message: ['Батлах нууц үг тохирохгүй байна.'],
              },
              { status: 422 }
            );

          const [userData] = (await executeQuery(
            'SELECT password FROM users WHERE id = ?',
            [params.id]
          )) as any;

          if (!(await bcrypt.compare(oldPassword, userData.password)))
            return NextResponse.json(
              {
                message: ['Хуучин нууц үг тохирохгүй байна'],
              },
              { status: 406 }
            );
        }
        return await bcrypt.hash(newPassword, 10);
      } else return null;
    };

    const password = await checkPassword();
    const image = await upload(file);

    await executeQuery(
      `UPDATE users SET name = ?, position = ?, permision = ?,${
        permision === 'manager'
          ? ` active = ${Boolean(active)},`
          : ' active = false,'
      }${image ? ` image = '${image}',` : ''}${
        !!password ? ` password = '${password}',` : ''
      } username = ? WHERE id = ?`,
      [name, position, permision, username, params.id]
    );

    return NextResponse.json({ message: ['Амжилттай хадгалагдлаа.'] });
  } catch (error) {
    console.log(error);
    throw new Error('Серверт алдаа гарлаа');
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await executeQuery('DELETE FROM users WHERE id = ?', [params.id]);
    return NextResponse.json({ message: ['Ажилттай устгагдлаа.'] });
  } catch (error) {
    return NextResponse.json(
      { message: ['Серверт алдаа гарлаа. Админд хандана уу!'] },
      { status: 500 }
    );
  }
};
