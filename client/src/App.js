import './App.css';
import { Route, Switch, useHistory } from "react-router-dom";
import Login from './Login';
import { useEffect, useState } from 'react';
import Register from './Register';
import axios from "axios";
import loadingImageSrc from "./assets/loading.gif";
import Todos from './Todos';

const imageLoading = `<img src=${loadingImageSrc} width="24px" alt="loading-icon" />`;
const BASE_URL = "https://todoapp.hp01.me/";
function App() {
  const history = useHistory();
  const [user, setUser] = useState({ email: undefined, password: undefined });

  const [register, setRegister] = useState({ email: "", password: "", showPassword: false });

  const [registerError, setRegisterError] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" }
  });

  const [login, setLogin] = useState({ email: "", password: "", showPassword: false });

  const [loginError, setLoginError] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" }
  });

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(undefined);

  useEffect(function () {
    if (history.location.pathname !== "/")
      history.push("/");
    cookieLogin();
  }, []);

  async function submitRegister(e) {
    let result = true;
    if (!validateEmail(register.email)) {
      result = false;
      registerError.email.error = true;
    }
    else registerError.email.error = false;
    if (register.password.length < 8) {
      result = false;
      registerError.password.error = true;
    }
    else registerError.password.error = false;

    if (result) {
      e.target.innerHTML = imageLoading;
      axios.post(BASE_URL + "register", register)
        .then(function ({ data }) {
          setUser({ ...data });
          e.target.innerHTML = "Register";
          history.push("/todos");
          getTodos({ username: register.email, password: register.password });
          deleteAllCookies();
          document.cookie = `email=${encodeURIComponent(register.email)}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
          document.cookie = `password=${encodeURIComponent(register.password)}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
        }).catch(function (err) {
          registerError.email.message = "Email address already in use";
          setRegisterError({ ...registerError });
          setUser({ email: undefined, password: undefined });
          e.target.innerHTML = "Register";
        });
    }
    setRegisterError({ ...registerError });
  }

  async function submitLogin(e) {
    let result = true;
    if (!validateEmail(login.email)) {
      result = false;
      loginError.email.error = true;
    }
    else loginError.email.error = false;
    if (login.password.length < 8) {
      result = false;
      loginError.password.error = true;
    }
    else loginError.password.error = false;

    if (result) {
      e.target.innerHTML = imageLoading;
      axios.post(BASE_URL + "login", null, {
        auth: {
          username: login.email,
          password: login.password
        }
      })
        .then(function () {
          document.cookie = `email=${encodeURIComponent(login.email)}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
          document.cookie = `password=${encodeURIComponent(login.password)}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
          setUser({ ...login });
          e.target.innerHTML = "Login";
          history.push("/todos");
          getTodos({ username: login.email, password: login.password });
        }).catch(function (err) {
          loginError.email.error = true;
          loginError.password.error = true;
          setLoginError({ ...loginError });
          setUser({ email: undefined, password: undefined });
          e.target.innerHTML = "Login";
        });
    }
    setLoginError({ ...loginError });
  }

  const cookieLogin = async () => {
    try {
      await new Promise(r => setTimeout(r, 2000));
      const email = decodeURIComponent(findInCookie("email"));
      const password = decodeURIComponent(findInCookie("password"));
      axios.post(BASE_URL + "login", null, {
        auth: {
          username: email,
          password: password
        }
      }).then(function () {
        setUser({ email: email, password: password });
        getTodos({ username: email, password: password });
        history.push("/todos");
      }).catch(function (err) {
        if (history.location.pathname !== "/login")
          history.push("/login");
      });
    } catch (err) {
      if (history.location.pathname !== "/login")
        history.push("/login");
    }
  }

  function getTodos(auth) {
    axios.get(BASE_URL + "todos", { auth: auth })
      .then(function ({ data }) {
        data.sort((a, b) => a.complete - b.complete);
        setTodos(data);
      }).catch(err => {
        console.error(err);
      });
  }

  async function addTodo(e) {
    e.target.innerHTML = imageLoading;
    axios.post(BASE_URL + "todos", { text: todo }, { auth: { username: user.email, password: user.password } })
      .then(function ({ data }) {
        setTodo("");
        todos.unshift(data);
        setTodos([...todos]);
        e.target.innerHTML = "Add Todo";
      }).catch(err => {
        console.log(err);
        e.target.innerHTML = "Add Todo";
      });
  }

  async function completeTodo(todo) {
    todo.complete = !todo.complete;
    axios.put(BASE_URL + "todos/" + todo._id, { complete: todo.complete },
      { auth: { username: user.email, password: user.password } }
    ).catch(err => console.log(err));
    todos.sort((a, b) => a.complete - b.complete);
    setTodos([...todos]);
  }

  async function deleteTodo(todo) {
    setTodos([...todos.filter(item => item._id !== todo._id)]);
    axios.delete(BASE_URL + "todos/" + todo._id, { auth: { username: user.email, password: user.password } })
      .catch(err => console.log(err));
  }

  return (
    <div className="App">
      <Switch>
        <Route path="/" render={() =>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px", padding: "0.2rem 0.5rem" }}>
              <h3>Todo App</h3>
              {user.email !== undefined ? <button className="btn" onClick={function () {
                deleteAllCookies();
                setUser({ email: undefined, password: undefined });
                history.push("/login");
              }}>Logout</button> : <></>}
            </div>
            <Switch>
              <Route exact path="/" render={() =>
                <div className="loader">
                  <img src={loadingImageSrc} width="40px" alt="image-loading"></img>
                </div>
              }></Route>
              <Route exact path="/login" render={() =>
                <Login validateEmail={validateEmail} login={login} setLogin={setLogin} loginError={loginError}
                  setLoginError={setLoginError} submitLogin={submitLogin} />
              }></Route>
              <Route exact path="/register" render={() =>
                <Register validateEmail={validateEmail} register={register} setRegister={setRegister} registerError={registerError}
                  setRegisterError={setRegisterError} submitRegister={submitRegister} />
              }></Route>
              <Route exact path="/todos" render={() =>
                <Todos todos={todos} todo={todo} setTodo={setTodo} addTodo={addTodo} completeTodo={completeTodo} deleteTodo={deleteTodo} />
              }></Route>
            </Switch>
          </div>
        }></Route>
      </Switch>
    </div>
  );
}

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function deleteAllCookies() {
  let cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

const findInCookie = (key) => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(key))
    .split('=')[1];
  return cookieValue;
}

export default App;
