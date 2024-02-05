import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

export const executeQuery = async (query: string, values?: any[] | any) => {
  try {
    const result = await db.query(query, values);
    await db.end();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
