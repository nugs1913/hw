import oracledb from 'oracledb';
import dbConfig from '../../dbconfig';

async function runQuery(id, passwd) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(`SELECT id, passwd FROM userdb WHERE id = :1 AND passwd = :2`, [id, passwd]);

    return result.rows.length > 0;
  } catch (err) {
    console.error(err);
    return false;
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
  if (req.method != 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, password } = req.body;

  try {
    const isValidUser = await runQuery(id, password);

    if (isValidUser) {
      if (req.session) {
        req.session.user = {
          id: id,
        };
        await req.session.save();
      }
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' , id , password});
    }
  } catch (error) {
    console.error('Error fetching data in API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
