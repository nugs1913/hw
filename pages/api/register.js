import oracledb from 'oracledb';
import dbConfig from '../../dbconfig';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, passwd, email, nickname } = req.body;

    try {
      const connection = await oracledb.getConnection(dbConfig);
      
      // 신규 유저는 기본적으로 grade가 bronze인 것으로 설정합니다.
      const grade = 'bronze';

      const result = await connection.execute(
        `INSERT INTO userdb (id, passwd, email, nickname, grade) VALUES (:id, :passwd, :email, :nickname, :grade)`,
        {
          id,
          passwd,
          email,
          nickname,
          grade,
        }
      );

      await connection.commit();
      await connection.close();

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('회원가입 에러:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
