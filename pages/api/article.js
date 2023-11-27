import oracledb from 'oracledb';
import dbConfig from '../../dbconfig'; // Oracle DB 연결 정보를 담은 파일

async function lobToString(lob) {
  return new Promise((resolve, reject) => {
    let lobData = '';
    lob.setEncoding('utf8'); // Assuming the data is encoded in UTF-8

    lob.on('data', (chunk) => {
      lobData += chunk.toString();
    });

    lob.on('end', () => {
      resolve(lobData);
    });

    lob.on('error', (err) => {
      reject(err);
    });
  });
}

async function runQuery(pid) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute('SELECT * FROM article WHERE articlenum = :1', [pid]);
    const article = result.rows[0];
    
    if (!article) {
      return null; // If article not found, return null or handle the case accordingly
    }

    // Get LOB data and convert it to string
    const lob = article[3]; // Assuming the LOB object is at index 3
    const lobData = await lobToString(lob);

    return {
      acticlenum: article[0],
      title: article[1],
      writer: article[2],
      body: lobData,
      time: new Date(article[4]).toLocaleString(),
    };

  } catch (err) {
    console.error(err);
    return null; // Return null or handle the error case accordingly
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
    const articles = await runQuery(req.body.pid);
    if (articles === null) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching data in api article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
