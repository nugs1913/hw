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
        window.location.href = '/pages/login';
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
    <main>
      <div className="container">
        <h1>회원가입</h1>
        <form className='form' onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor="passwd">Password:</label>
            <input
              type="password"
              id="passwd"
              value={formData.passwd}
              onChange={handleChange}
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
          />
          </div>
          <div className='input-group'>
            <label htmlFor="nickname">Nickname:</label>
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className='submit-btn'>가입하기</button>
        </form>
      </div>
    </main>
  );
}
