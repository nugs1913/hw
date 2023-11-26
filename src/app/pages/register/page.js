"use client"

import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    id: '',
    passwd: '',
    email: '',
    nickname: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // 서버 응답 확인

      if (response.status === 200 && data.success) {
        alert('회원가입이 완료되었습니다!');
        window.location.href = '/';
      } else {
        alert('회원가입 실패: ' + data.error);
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="signin_container">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="id">ID:</label>
        <input
          type="text"
          id="id"
          value={formData.id}
          onChange={handleChange}
          required
        /><br/><br/>

        <label htmlFor="passwd">Password:</label>
        <input
          type="password"
          id="passwd"
          value={formData.passwd}
          onChange={handleChange}
          required
        /><br/><br/>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br/><br/>

        <label htmlFor="nickname">Nickname:</label>
        <input
          type="text"
          id="nickname"
          value={formData.nickname}
          onChange={handleChange}
          required
        /><br/><br/>

        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}
