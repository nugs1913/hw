
import dbConfig from '../../dbconfig';
import oracledb from 'oracledb';

export default async function handler(req, res) {
  let connection;
  if (req.method === 'POST') {
    const {body, commentnum } = req.body;

    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `UPDATE comments SET body = :body, time = SYSTIMESTAMP WHERE commentnum = :commentnum`,
        {
          body,
          commentnum,
        }
      );

      await connection.commit();
      await connection.close();

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('댓글 작성 에러:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
