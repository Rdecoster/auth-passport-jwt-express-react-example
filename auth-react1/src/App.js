import React, { useState } from 'react';
import Auth from './service/auth';
import './App.css';
import axios from 'axios';

function App() {
  const [login, setLogin] = useState({
    username: '',
    password: '',
    regName: '',
    regPass: '',
  });

  const [isAuth, setAuth] = useState(false);

  function handleInputChange(e) {
    setLogin({
      // spread in previous state with object spread operator
      ...login,
      [e.target.name]: e.target.value,
    });
  }

  function handelLogIn(e) {
    e.preventDefault();
    console.log(e);
    axios
      .post('/login', login)
      .then((data) => {
        console.log(data, 'my data log');
        const token = data.data.token;
        console.log(token, ' my token from login');
        Auth.authenticateUser(token);
        console.log(Auth.getToken(), 'my token');
        setAuth(true);
      })
      .catch((err) => {
        console.log(err.response.data.msg, err.response, 'my error');
        alert(err.response.data.msg);
      });
    Auth.deauthenticateUser();
  }

  function handelReg(e) {
    e.preventDefault();
    console.log(e);
    axios
      .post('/register', login)
      .then((data) => {
        console.log(data.body, 'my data reg');
      })
      .catch((err) => {
        console.log(err.response.data.msg, err.response, 'my error');
        alert(err.response);
      });
  }

  function checkToken(e) {
    // adding the token to the headers using axios configs options following the Bearer auth scheme
    // in the backend file a function that extracts the token looks for the bearer scheme when searching the headers.
    e.preventDefault();
    axios({
      method: 'get',
      url: '/protected',
      headers: { Authorization: 'Bearer ' + Auth.getToken() },
    })
      .then((data) => {
        console.log(data, 'my data protected');
      })
      .catch((err) => {
        console.log(err.response, 'my error');
        alert(err.response.data);
        setAuth(false);
      });
  }

  function deleteToken(e) {
    e.preventDefault();
    Auth.deauthenticateUser();
    setAuth(false);
  }

  return (
    <div
      className="App"
      style={{
        width: '100%',
        height: '400px',
        padding: '1rem',
        margin: 'auto',
        top: '20%',
        position: 'absolute',
      }}>
      <div className="login" style={{ padding: '1rem', margin: 'auto' }}>
        <form>
          <label for="uname">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            required
            onChange={handleInputChange}
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            onChange={handleInputChange}
          />

          <button type="submit" onClick={handelLogIn}>
            Login
          </button>
          <label></label>
        </form>
      </div>
      <div className="reg">
        <form>
          <label for="uname">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="regName"
            required
            onChange={handleInputChange}
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="regPass"
            required
            onChange={handleInputChange}
          />

          <button type="submit" onClick={handelReg}>
            Register
          </button>
          <label></label>
        </form>
      </div>
      <div
        style={{
          margin: 'auto',
          background: isAuth ? 'green' : 'red',
          width: '400px',
          height: 'auto',
          fontSize: '50px',
          textAlign: 'center',
          padding: '20px',
        }}>
        {isAuth ? 'You are Authenticated' : 'you are not authenticated'}
        <button onClick={checkToken}>check Authentication</button>
        <button onClick={deleteToken}>Delete token</button>
      </div>
    </div>
  );
}

export default App;
