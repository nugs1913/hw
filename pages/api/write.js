
import dbConfig from '../../dbconfig';
import oracledb from 'oracledb';

export default async function handler(req, res) {
  let connection;
  if (req.method === 'POST') {
    const { title, body, writer } = req.body;

    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `INSERT INTO article (articlenum, title, body, writer) VALUES (DBMS_RANDOM.STRING('X', 30), :title, :body, :writer)`,
        {
          title,
          body,
          writer,
        }
      );

      await connection.commit();
      await connection.close();

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('게시글 작성 에러:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
