"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CreatePost({ params }) {
    const [article, setArticle] = useState({ title: '', body: '', writer:'' });
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        async function fetchArticle() {
            try {
                const response = await fetch('/api/article', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pid: params.pid }),
                });
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching data in page', error);
            }
        }
        fetchArticle();
    }, [params.pid]);

    useEffect(() => {
        setTitle(article.title || '');
        setBody(article.body || '');
    }, [article]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pid = params.pid;

        try {
            const id = sessionStorage.getItem("id");
            if (id != article.writer) {
                alert("잘못된 접근입니다.");
                window.location.href = '/';
            } else {
                const response = await fetch('/api/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        articlenum: pid,
                    }),
                });

                if (response.status === 200) {
                    console.log('게시글이 성공적으로 수정되었습니다.');
                    window.location.href = `/pages/${pid}`;
                } else {
                    console.error('게시글 수정 실패');
                }
            }
        } catch (error) {
            console.error('게시글 수정 에러:', error);
        }
    };

    return (
        <main>
            <h1>게시글 수정</h1>
            <form onSubmit={handleSubmit} className='article_make'>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={handleTitleChange}
                    required
                />
                <textarea
                    placeholder="내용"
                    value={body}
                    onChange={handleBodyChange}
                    required
                ></textarea>
                <div>
                    <button type="submit">수정</button>
                    <Link href={`/pages/${[params.pid]}`}><button>취소</button></Link>
                </div>
            </form>
        </main>
    );
}
