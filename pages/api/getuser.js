import oracledb from 'oracledb';
import dbConfig from '../../dbconfig';

async function runQuery() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM userdb');
    return result.rows;

  } catch (err) {
    console.error(err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const Comments = await runQuery();
    res.status(200).json(Comments);
  } catch (error) {
    console.error('Error fetching data in api COMMENT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
