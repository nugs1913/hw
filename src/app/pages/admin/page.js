"use client"
import { useState, useEffect } from 'react';

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(true);
    const [userinfo, setUserinfo] = useState([]);

    const userDelete = async (e) => {
        try {
          const response = await fetch('/api/udelete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: e})
          });
    
          if (response.status === 200) {
            alert('유저가 삭제되었습니다.');
            window.location.reload();
          } else {
            alert('유저 삭제 실패');
          }
        } catch (error) {
          alert('유저 삭제 에러:', error);
        }
      };

    useEffect(() => {
        async function fetchAdmin() {
            try {
                const response = await fetch('/api/isadmin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: sessionStorage.getItem("id") })
                });
                const data = await response.json();
                if (data[0][1] == sessionStorage.getItem("id"))
                    setIsAdmin(true);
                else
                    setIsAdmin(false)
            } catch (error) {
                console.error('Error fetching data in page', error);
                setIsAdmin(false); 
            }
        }
        fetchAdmin();
    }, []);

    useEffect(() => {
        if (isAdmin === false)
            window.location.href = '/';
        else {
            async function fetchUser() {
                try {
                  const response = await fetch('/api/getuser', {
                    method: "POST"
                  });
                  const data = await response.json();
                  const transformedData = data.map(userdb => {
                    return {
                      id: userdb[0],
                      passwd: userdb[1],
                      email: userdb[2],
                      nickname: userdb[3],
                      grade: userdb[4]
                    };
                  });
          
                  setUserinfo(transformedData);
                } catch (error) {
                  console.error('Error fetching data in page', error);
                }
              }
              fetchUser();
        }
    }, [isAdmin]);

    if (isAdmin === false) {
        return null;
    }

    return (
        <main>
            <h1>User info</h1>
            {userinfo.map((user, index) => (
                <div className='userinfo' key={index}>
                    <p>{user.id}</p>
                    <p>{user.passwd}</p>
                    <p>{user.email}</p>
                    <p>{user.nickname}</p>
                    <p>{user.grade}</p>
                    <button onClick={() => userDelete(user.id)}>삭제</button>
                </div>
            ))}
            <div className='end'></div>
        </main>
    );
}

