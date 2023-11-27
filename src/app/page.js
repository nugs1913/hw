"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sessionId, setSessionId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword,
          cat: category
        }),
      });
      const data = await response.json();

      const transformedData = data.map(article => ({
        acticlenum: article[0],
        title: article[1],
        writer: article[2],
        time: new Date(article[3]).toLocaleString()
      })).reverse();

      setArticles(transformedData);

      if (response.status === 200) {
        console.log('검색이 성공적으로 되었습니다.');
      } else {
        console.error('검색 실패');
      }
    } catch (error) {
      console.error('검색 에러:', error);
    }
  };

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/gettitle');
        const data = await response.json();

        const transformedData = data.map(article => ({
          acticlenum: article[0],
          title: article[1],
          writer: article[2],
          time: new Date(article[3]).toLocaleString()
        })).reverse();

        setArticles(transformedData);
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
    fetchArticles();

    const sessionid = sessionStorage.getItem('id');
    setSessionId(sessionid)
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <main>
      <p>hello {sessionId}</p>
      <form className="search_container" onSubmit={handleSubmit}>
        <select name='cat' value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value='writer'>작성자</option>
          <option value='title'>제목</option>
          <option value='body'>내용</option>
        </select>
        <input
          type="text"
          value={keyword}
          required
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
      {currentItems.map((article, index) => (
        <div className="article_header" key={index}>
          <p>{(currentPage - 1) * itemsPerPage - index + 2}</p>
          <Link href={`/pages/${article.acticlenum}`}><p>{article.title}</p></Link>
          <p>{article.writer}</p>
          <p>{article.time}</p>
        </div>
      ))}
      <div className="writebtn">
        {sessionId ? <Link href={'/pages/write'}><button>글쓰기</button></Link> : null }
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          &#60;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          &#62;
        </button>
      </div>
    </main>
  );
}

