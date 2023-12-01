
import dbConfig from '../../dbconfig';
import oracledb from 'oracledb';

export default async function handler(req, res) {
    let connection;
    if (req.method === 'POST') {
        const { id } = req.body;

        try {
            connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
                `DELETE FROM userdb WHERE id = :id`,
                {
                    id,
                }
            );

            await connection.commit();
            await connection.close();

            res.status(200).json({ success: true, result });
        } catch (error) {
            console.error('유저 삭제 에러:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
