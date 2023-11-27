"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home({ params }) {
  const query = params.pid;
  const [articles, setArticles] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [Comment, setComment] = useState([]);
  const [body, setBody] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);


  const ArticleDelete = async () => {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({pid: query})
      });

      if (response.status === 200) {
        alert('삭제되었습니다.');
        window.location.href = '/';
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      alert('삭제 에러:', error);
    }
  };

  const handleSubmit = async () => {
    const id = sessionStorage.getItem('id');

    try {
      const response = await fetch('/api/cwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articlenum: query,
          body,
          writer: id,
        }),
      });

      if (response.status === 200) {
        console.log('댓글이 성공적으로 작성되었습니다.');
        window.location.reload();
      } else {
        console.error('댓글 작성 실패');
      }
    } catch (error) {
      console.error('댓글 작성 에러:', error);
    }
  };

  const commentDelete = async (e) => {
    try {
      const response = await fetch('/api/cdelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({pid: e})
      });

      if (response.status === 200) {
        alert('댓글이 삭제되었습니다.');
        window.location.reload();
      } else {
        alert('댓글 삭제 실패');
      }
    } catch (error) {
      alert('댓글 삭제 에러:', error);
    }
  };

  const handleEdit = (commentId, body) => {
    setEditMode(true);
    setEditedComment(body);
    setSelectedCommentId(commentId);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedComment('');
    setSelectedCommentId(null);
  };

  const handleEditFormSubmit = async () => {

    try {
      const response = await fetch('/api/cmodify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentnum: selectedCommentId,
          body: editedComment,
        }),
      });

      if (response.status === 200) {
        setEditMode(false);
        setEditedComment('');
        setSelectedCommentId(null);
        window.location.reload();
      } else {
        console.error('Failed to modify comment');
      }
    } catch (error) {
      console.error('Error modifying comment:', error);
    }
  };

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ pid : query, writer : articles.writer })
        });
        const data = await response.json();
  
        setArticles(data);
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
    
    fetchArticles();

    async function fetchComment() {
      try {
        const response = await fetch('/api/getcomment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ articlenum : query })
        });
        const data = await response.json();
        const transformedData = data.map(comment => {
          return {
            writer: comment[0],
            body: comment[1],
            time: new Date(comment[2]).toLocaleString(),
            commentnum: comment[3]
          };
        }).reverse();

        setComment(transformedData);
      } catch (error) {
        console.error('Error fetching data in page', error);
      }
    }
    fetchComment();

    const id = sessionStorage.getItem("id");
    setIsOwner(id);
  }, []);

  return (
    <main>
        <div>
          <div className="article_header">
            <p>now</p>
            <p>{articles.title}</p>
            <p>{articles.writer}</p>
            <p>{articles.time}</p>
          </div>
          <div className="article_body">
            {articles.body}
          </div>
          {isOwner != null && isOwner == articles.writer ? <div className="article_control"><Link href={`/pages/modify/${query}`}><button>수정</button></Link><button onClick={ArticleDelete}>삭제</button></div> : null}
          <div>
          {isOwner != null ?
          <form onSubmit={handleSubmit} className="comment_write">
            <textarea
              type="text"
              placeholder="댓글"
              value={body}
              required
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <button type="submit">작성</button>
          </form> :
          <div className="comment_write"><p>로그인시 댓글을 작성할 수 있습니다.</p></div> }
          </div>
          <div className="comment_main">
            {Comment.map((comment, index) => (
              <div className="comment_inner" key={index}>
                <p>{comment.writer}</p>
                {editMode && selectedCommentId === comment.commentnum ? (
                  <form onSubmit={handleEditFormSubmit} className="comment_modify">
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <div>
                      <button type="submit">확인</button>
                      <button type="button" onClick={handleCancel}>취소</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>{comment.body}</p>
                    {isOwner != null && isOwner === comment.writer ? (
                      <div>
                        <button onClick={() => handleEdit(comment.commentnum, comment.body)}>수정</button>
                        <button onClick={() => commentDelete(comment.commentnum)}>삭제</button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </>
                )}
                <p>{comment.time}</p>
              </div>
            ))}
          </div>
        </div>
    </main>
  )
}
