"use client"

import { useState } from 'react';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const id = sessionStorage.getItem('id'); // 세션에서 ID 가져오기
    if (id == null) {
        alert("로그인을 하세요");
        window.location.href = '/pages/login'; // 로그인 성공 시 홈페이지로 이동
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = sessionStorage.getItem('id');

    try {
      const response = await fetch('/api/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          writer: id,
        }),
      });

      if (response.status === 200) {
        console.log('게시글이 성공적으로 작성되었습니다.');
        window.location.href = '/';
        // 추가적인 처리나 리다이렉션 등을 할 수 있어
      } else {
        console.error('게시글 작성 실패');
      }
    } catch (error) {
      console.error('게시글 작성 에러:', error);
    }
  };

  return (
    <main>
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit} className='article_make'>
        <input
          type="text"
          placeholder="제목"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit">작성</button>
      </form>
    </main>
  );
}
