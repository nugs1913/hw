"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
  const [SessionId, setSessionId ] = useState()

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/gettitle');
        const data = await response.json();

        const transformedData = data.map(article => {
          const articleTime = new Date(article[3]);

          const formattedTime = `${articleTime.getFullYear()}-${(articleTime.getMonth() + 1).toString().padStart(2, '0')}-${articleTime.getDate().toString().padStart(2, '0')} ${articleTime.getHours().toString().padStart(2, '0')}:${articleTime.getMinutes().toString().padStart(2, '0')}:${articleTime.getSeconds().toString().padStart(2, '0')}`;

          return {
            acticlenum: article[0],
            title: article[1],
            writer: article[2],
            time: formattedTime
          };
        });

        setArticles(transformedData.reverse());
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
    fetchArticles();

    // TODO: 세션 상태를 확인하는 로직 추가
    const session = sessionStorage.getItem('isLoggedIn');
    setIsLoggedIn(session ? true : false);
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
      <p>hello {SessionId}</p>
      {currentItems.map((article, index) => (
        <div className="article_header" key={index}>
          <p>{(totalPages - (currentPage - 1)) * itemsPerPage - index}</p>
          <Link href={`/pages/${article.acticlenum}`}><p>{article.title}</p></Link>
          <p>{article.writer}</p>
          <p>{article.time}</p>
        </div>
      ))}
      <div className="writebtn">
        {sessionStorage.getItem("id") ? <Link href={'/pages/write'}><button>글쓰기</button></Link> : null }
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
