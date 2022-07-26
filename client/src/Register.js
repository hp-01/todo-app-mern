import { Link } from "react-router-dom";

function Register({ validateEmail, register, setRegister, registerError, setRegisterError, submitRegister }) {
    return (
        <div id="register">
            <h4 style={{ textAlign: "center" }}>Register</h4>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input className={`form-control ${registerError.email.error ? "is-invalid" : ""}`} name="email" value={register.email} onChange={function (e) {
                    if (!validateEmail(e.target.value))
                        registerError.email.error = true;
                    else
                        registerError.email.error = false;
                    setRegister({ ...register, email: e.target.value });
                    registerError.email.message = "";
                    setRegisterError({ ...registerError });
                }}></input>
                <p style={{ color: "red" }}>{registerError.email.message}</p>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type={register.showPassword ? "text" : "password"} className={`form-control ${registerError.password.error ? "is-invalid" : ""}`} name="password" value={register.password} onChange={function (e) {
                    if (e.target.value.length < 8)
                        registerError.password.error = true;
                    else
                        registerError.password.error = false;
                    setRegister({ ...register, password: e.target.value });
                    setRegisterError({ ...registerError });
                }}></input>
                <p>Password should have minimum 8 character</p>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value={register.showPassword} onChange={function (e) {
                    register.showPassword = !register.showPassword;
                    setRegister({ ...register });
                }} />
                <label className="form-check-label">Show Password</label>
            </div>
            <p></p>
            <button onClick={submitRegister} className="btn btn-primary btn-block">Register</button>
            <br />
            <Link to="/login">If already user please login</Link>
        </div>
    )
}

export default Register;