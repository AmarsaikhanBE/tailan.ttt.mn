import { authOptions } from '@/lib/auth';
import { executeQuery } from '@/lib/mysql';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { reportId, departmentId } = Object.fromEntries(
    new URL(request.url).searchParams.entries()
  ) as any;

  const q_values = (await executeQuery(
    `SELECT * FROM points WHERE reportId = ? AND departmentId = ?`,
    [reportId, departmentId]
  )) as any[];

  const mpValues = await executeQuery(
    'SELECT point.id AS id, point.reportId AS reportId, point.departmentId AS departmentId, point.value AS value, user.id AS userId, user.name AS userName, user.position AS userPosition, user.image AS userImage FROM manager_points AS point LEFT JOIN users AS user ON point.userId = user.id WHERE point.reportId = ? AND point.departmentId = ?',
    [reportId, departmentId]
  );

  const questions = (await executeQuery(
    'SELECT * FROM questions WHERE reportId = ?',
    [reportId]
  )) as any[];
  questions.map(
    (question) =>
      (question.value = q_values.filter(
        (value) => value.questionId === question.id
      )[0])
  );

  return NextResponse.json({ questions, mpValues });
};

export const POST = async (request: NextRequest) => {
  try {
    const { user } = (await getServerSession(authOptions)) as any;
    const { reportId, departmentId } = Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ) as any;
    const formData = await request.formData();
    const { mpId, mpValue } = Object.fromEntries(formData.entries());
    const questionIds = formData.getAll('questionId');
    const valueIds = formData.getAll('valueId');
    const pointValues = formData.getAll('pointValue');

    if (!!mpValue)
      await executeQuery(
        !!mpId
          ? `UPDATE manager_points SET value = ? WHERE id = ${mpId}`
          : `INSERT INTO manager_points (reportId, departmentId, userId, value) VALUES (${reportId}, ${departmentId}, ${user?.id}, ?)`,
        [mpValue]
      );

    pointValues.map(
      async (value, i) =>
        await executeQuery(
          !!valueIds[i]
            ? `UPDATE points SET value = ? WHERE id = ${valueIds[i]}`
            : `INSERT INTO points (departmentId, reportId, questionId, value) VALUES (${departmentId}, ${reportId}, ${questionIds[i]}, ?)`,
          [value]
        )
    );

    return NextResponse.json({ message: ['trying'] });
  } catch (error) {
    return NextResponse.json({
      message: ['Серверт алдаа гарлаа. Админд хандана уу!'],
    });
  }
};
