
import dbConfig from '../../dbconfig';
import oracledb from 'oracledb';

export default async function handler(req, res) {
    let connection;
    if (req.method === 'POST') {
        const { id } = req.body;

        try {
            connection = await oracledb.getConnection(dbConfig);
            const resultComment = await connection.execute(
                `DELETE FROM comments WHERE writer = :id`,
                {
                    id,
                }
            );
            const resultArticle = await connection.execute(
                `DELETE FROM article WHERE writer = :id`,
                {
                    id,
                }
            );
            const resultUser = await connection.execute(
                `DELETE FROM userdb WHERE id = :id`,
                {
                    id,
                }
            );

            const result = resultArticle && resultComment && resultUser;

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
