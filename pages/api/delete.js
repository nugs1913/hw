
import dbConfig from '../../dbconfig';
import oracledb from 'oracledb';

export default async function handler(req, res) {
    let connection;
    if (req.method === 'POST') {
        const { pid, writer } = req.body;

        try {
            connection = await oracledb.getConnection(dbConfig);
            const resulta = await connection.execute(
                `DELETE FROM article WHERE articlenum = :pid`,
                {
                pid,
                }
            );
            const resultc = await connection.execute(
                `DELETE FROM comments WHERE articlenum = :pid`,
                {
                pid,
                }
            );

            await connection.commit();
            await connection.close();

            res.status(200).json({ success: true, resulta });
        } catch (error) {
            console.error('게시글 삭제 에러:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
