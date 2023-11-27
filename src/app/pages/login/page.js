"use client"

import { useState } from "react";

export default function LoginForm() {
  const [loginInfo, setLoginInfo] = useState({
    id: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const data = await response.json();
      console.log("로그인 결과:", data);

      if (response.ok) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("id", id.value)
        window.location.href = '/';
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="id" className="label">ID:</label>
          <input type="text" id="id" name="id" value={loginInfo.id} onChange={handleChange} className="input-field" />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="label">Password:</label>
          <input type="password" id="password" name="password" value={loginInfo.password} onChange={handleChange} className="input-field" />
        </div>
        <button type="submit" className="submit-btn">로그인</button>
      </form>
    </div>
  );
}
