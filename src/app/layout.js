"use client"

import { Inter } from 'next/font/google'
import { useState, useEffect } from "react";
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState('');

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST'
      });

      if (response.status === 200) {
        setIsLoggedIn(false);
        sessionStorage.clear();
        alert('로그아웃 되었습니다.');
        window.location.href = '/';
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      alert('로그아웃 에러:', error);
    }
  };
  
  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem("id"));
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Link href={'/'}>HOME</Link>
          <div>
            {isLoggedIn ? 
            <button onClick={handleLogout}>logout</button> : 
            <div><Link href={'/pages/login'}><button>login</button></Link><Link href={'/pages/register'}><button>signin</button></Link></div>
            }
          </div>
        </header>
        {children}
        <footer>
          <span>202014910 김하민 데이터 베이스 과제</span>
        </footer>
      </body>
    </html>
  )
}
