import mysql from 'mysql2/promise';

export const executeQuery = async (query: string, values?: any[] | any) => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [result] = await connection.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};
