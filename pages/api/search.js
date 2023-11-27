import oracledb from 'oracledb';
import dbConfig from '../../dbconfig';

async function runQuery(cat, keyword) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    switch(cat) {
        case 'title':
            const resultTitle = await connection.execute(
                'SELECT articlenum, title, writer, time FROM article WHERE title = :keyword ORDER BY time ASC',
                {
                    keyword,
                }
            );
            return resultTitle.rows;
        case 'writer':
            const resultWriter = await connection.execute(
                'SELECT articlenum, title, writer, time FROM article WHERE writer = :keyword ORDER BY time ASC',
                {
                    keyword,
                }
            );
            return resultWriter.rows;
        case 'body':
            keyword = '%' + keyword + '%';
            const resultBody = await connection.execute(
                'SELECT articlenum, title, writer, time FROM article WHERE body like :keyword ORDER BY time ASC',
                {
                    keyword,
                }
            );
            return resultBody.rows;
    }

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
    const search = await runQuery(req.body.cat, req.body.keyword);
    res.status(200).json(search);
  } catch (error) {
    console.error('Error fetching data in api search:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
