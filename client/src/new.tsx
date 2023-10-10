import React, { useEffect, useState } from 'react';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/session")
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert("Bạn chưa login");
        } else {
          if (data.role === 'admin') {
            fetch("http://localhost:4000/task")
              .then(res => res.json())
              .then(value => {
                setTasks(value);
              });
          }
          if (data.role === 'manager') {
            fetch("http://localhost:4000/task")
              .then(res => res.json())
              .then(value => {
                setTasks(value.filter(task => task.user.some(user => user.permission === 'all')));
              });
          }
          fetch("http://localhost:4000/menu?email=" + data.email)
            .then(res => res.json())
            .then(value => {
              // Update the menu state here
            });
        }
      });
  }, []);

  const handleAddUser = (task, input) => {
    if (input !== "") {
      // Make the API call to add the user to the task
      alert("Thêm thành công");
      // Reload the page or update the state accordingly
    } else {
      alert("Input không được để trống");
    }
  };

  const handleDeleteUser = (task, username) => {
    // Make the API call to delete the user from the task
    alert("Xoá thành công");
    // Reload the page or update the state accordingly
  };

  return (
    <div>
      <div id="menu" style={{ height: '50px', borderBottom: '1px #ccc solid', alignItems: 'center', textAlign: 'center' }}>
        {/* Render the menu content here */}
      </div>

      <div style={{ borderBottom: '1px #ccc solid', marginBottom: '10px' }}>
        <ol>
          {tasks.map((task, index) => (
            <li key={index}>
              <h2>{task.task}</h2>
              <ul>
                {task.user.map((user, userIndex) => (
                  <li key={userIndex}>
                    {user.username}
                    <button onClick={() => handleDeleteUser(index, user.username)}>Xoá</button>
                  </li>
                ))}
              </ul>
              <input placeholder="Thêm người dùng" id={`input${index}`} />
              <button onClick={() => handleAddUser(index, document.getElementById(`input${index}`).value)}>Thêm</button>
            </li>
          ))}
        </ol>
      </div>

      <form action="/upload" method="post">
        <input type="file" name="excelFile" id="" />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default App;
