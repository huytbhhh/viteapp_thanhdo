import React, { useState, useEffect } from 'react';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState([]);
  const [menuHtml, setMenuHtml] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const cookieEmail = document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const cookieRole = document.cookie.replace(/(?:(?:^|.*;\s*)role\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (!cookieEmail) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
      setEmail(cookieEmail);
      setRole(cookieRole);

      if (cookieRole === 'admin' || cookieRole === 'manager') {
        fetch('http://localhost:8080/task')
          .then((res) => res.json())
          .then((value) => {
            setTasks(value);
          });
      }

      fetch(`http://localhost:8080/menu?email=${cookieEmail}`)
        .then((res) => res.json())
        .then((value) => {
          setMenuHtml(value.html);
        });
    }
  }, []);

  function handleLogin() {
    const emailInput = document.getElementById('email').value;
    const passInput = document.getElementById('pass').value;

    fetch(`http://localhost:8080/api/signin?email=${emailInput}&password=${passInput}`)
      .then((res) => res.json())
      .then((data) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `role=${data.user.role}`;
        setIsLogin(true);
        setEmail(data.user.email);
        setRole(data.user.role);
        window.location.href="./"
      });
  }

  function add(task) {
    task=task+1;
    if (inputValue !== '') {
    const cookieEmail = document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:8080/task?task=${task}&addUser=${inputValue}&email=${cookieEmail}`, true);
      xhr.send();
      alert('Thêm thành công');
      window.location.reload();
    } else {
      alert('Input không được để trống');
    }
  }

  function deleteUser(task, username) {
    task=task+1;
    const cookieEmail = document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8080/task?task=${task}&DeleteUser=${username}&email=${cookieEmail}`, true);
    xhr.send();
    alert('Xoá thành công');
    window.location.reload();
  }

  return (
    <div>
      {isLogin ? (
        <div>
          <div
            id="menu"
            style={{
              height: '50px',
              borderBottom: '1px #ccc solid',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {menuHtml}
          </div>

          <div style={{ borderBottom: '1px #ccc solid', marginBottom: '10px' }}>
            <ol id="ol">
              {tasks.map((element, i) => (
                <li key={i}>
                  <h2>{element.task}</h2>
                  <ul>
                    {element.user.map((vas, index) => (
                      <li key={index}>
                        {vas.username}
                        {vas.permission === 'all' && (
                          <button onClick={() => deleteUser(i, vas.username)}>Xoá</button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <input
                    placeholder="Thêm người dùng"
                    id={'input' + i}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button onClick={() => add(i)}>Thêm</button>
                </li>
              ))}
            </ol>
          </div>
          <form action="/upload" method="post">
            <input type="file" name="excelFile" encType="multipart/form-data" id="" />
            <button type="submit">Gửi</button>
          </form>
        </div>
      ) : (
        <div id="login" style={{ display: 'block' }}>
          <input type="text" name="email" id="email" placeholder="email" /><br />
          <input type="text" name="pass" id="pass" placeholder="pass" /><br />
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      )}
    </div>
  );
}

export default App;
