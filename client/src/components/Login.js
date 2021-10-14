import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function Login(props) {
  const history = useHistory();
  const [userLogin, setUserLogin] = useState({});
  const [userRegister, setUserRegister] = useState({});
  const [loginSuccess, setLoginSuccess] = useState({
    success: true,
    message: ''
  });
  const [registerSuccess, setRegisterSuccess] = useState({
    success: false,
    message: ''
  });
  const [registerFail, setRegisterFail] = useState({
    fail: false,
    message: ''
  });

  const handleLoginInput = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterInput = (e) => {
    setUserRegister({
      ...userRegister,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    props.onLogin(userLogin, history);
    setUserLogin({});
  };

  const handleRegister = () => {
    props.onRegister(userRegister, history);
    setUserRegister({});
  };

  return (
    <section className="">
      <div className="">
        <h3>Login</h3>
        {!loginSuccess.success ? <p>{loginSuccess.message}</p> : null}
        <input
          type="text"
          onChange={handleLoginInput}
          name="username"
          placeholder="Username"
        />
        <input
          type="password"
          onChange={handleLoginInput}
          name="password"
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="">
        <h3>Sign Up</h3>
        {registerSuccess.success ? <p>{registerSuccess.message}</p> : null}
        {registerFail.fail ? <p>{registerFail.message}</p> : null}
        <input
          type="text"
          onChange={handleRegisterInput}
          name="firstName"
          placeholder="First Name"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="lastName"
          placeholder="Last Name"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="email"
          placeholder="Email"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="username"
          placeholder="Username"
        />
        <input
          type="password"
          onChange={handleRegisterInput}
          name="password"
          placeholder="Password"
        />
        <input
          type="password"
          onChange={handleRegisterInput}
          name="confirmPassword"
          placeholder="Confirm Password"
        />
        <button onClick={handleRegister}>Register</button>
      </div>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data, history) => dispatch(actionCreators.login(data, history)),
    onRegister: (data, history) =>
      dispatch(actionCreators.register(data, history))
  };
};

export default connect(null, mapDispatchToProps)(Login);
