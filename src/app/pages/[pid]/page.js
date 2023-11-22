"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home({ params }) {
  const query = params.pid;
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ pid : query })
        });
        const data = await response.json();
  
      setArticles(data);
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
    
    fetchArticles();
  }, []);

  if (!setArticles){return <div>로딩중</div>;}

  return (
    <main>
        <div>
            <div className="acticle_header">
            <p>{articles.acticlenum}</p>
            <p>{articles.title}</p>
            <p>{articles.writer}</p>
            <p>{articles.time}</p>
            </div>
            <div className="acticle_body">
            {articles.body}
            </div>
            <div className="acticle_control">
            <button>수정</button><button>삭제</button>
            </div>
        </div>
    </main>
  )
}
