import { Link } from "react-router-dom";

function Login({ validateEmail, login, setLogin, loginError, setLoginError, submitLogin }) {
    return (
        <div id="login">
            <h4 style={{ textAlign: "center" }}>Login</h4>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input className={`form-control ${loginError.email.error ? "is-invalid" : ""}`} name="email" value={login.email} onChange={function (e) {
                    if (!validateEmail(e.target.value))
                        loginError.email.error = true;
                    else
                        loginError.email.error = false;
                    setLogin({ ...login, email: e.target.value });
                    loginError.email.message = "";
                    setLoginError({ ...loginError });
                }}></input>
                <p>{loginError.email.message}</p>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type={login.showPassword ? "text" : "password"} className={`form-control ${loginError.password.error ? "is-invalid" : ""}`} name="password" value={login.password} onChange={function (e) {
                    if (e.target.value.length < 8)
                        loginError.password.error = true;
                    else
                        loginError.password.error = false;
                    setLogin({ ...login, password: e.target.value });
                    setLoginError({ ...loginError });
                }}></input>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value={login.showPassword} onChange={function (e) {
                    login.showPassword = !login.showPassword;
                    setLogin({ ...login });
                }} />
                <label className="form-check-label">Show Password</label>
            </div>
            <p style={{ color: "red" }}>{loginError.password.message}</p>
            <button onClick={submitLogin} className="btn btn-primary btn-block">Login</button>
            <br />
            <Link to="/register">If you are new user please register.</Link>
        </div>
    )
}

export default Login;