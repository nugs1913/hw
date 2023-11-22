"use client"

import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/gettitle');
        const data = await response.json();

        // 데이터 변환
        const transformedData = data.map(article => {
          const articleTime = new Date(article[3]);

          const formattedTime = `${articleTime.getFullYear()}-${(articleTime.getMonth() + 1).toString().padStart(2, '0')}-${articleTime.getDate().toString().padStart(2, '0')} ${articleTime.getHours().toString().padStart(2, '0')}:${articleTime.getMinutes().toString().padStart(2, '0')}:${articleTime.getSeconds().toString().padStart(2, '0')}`;
        
          return {
            acticlenum: article[0],
            title: article[1],
            writer: article[2],
            time: formattedTime // 시간을 년-월-일 시:분:초 형식으로 변환하여 추가
          };
        });

        setArticles(transformedData);
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
  
    fetchArticles();
  }, []);

  return (
    <main>
      {articles.map((article, index) => (
        <div className="acticle_header" key={index}>
          <p>{index}</p>
          <Link href={`/pages/${article.acticlenum}`}><p>{article.title}</p></Link>
          <p>{article.writer}</p>
          <p>{article.time}</p>
        </div>
      ))}
    </main>
  );
}
