import { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function Login(props) {
  const history = useHistory();
  const [userLogin, setUserLogin] = useState({});

  const handleLoginInput = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    props.onLogin(userLogin, history);
    setUserLogin({});
  };

  return (
    <section id="login">
      <div id="loginCredentials">
        <h3 id="loginTitle">Login</h3>
        <input
          type="text"
          onChange={handleLoginInput}
          name="username"
          placeholder="Username"
          className="loginInputs"
        />
        <input
          type="password"
          onChange={handleLoginInput}
          name="password"
          placeholder="Password"
          className="loginInputs"
        />
        <button id="loginBtn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data, history) => dispatch(actionCreators.login(data, history))
  };
};

export default connect(null, mapDispatchToProps)(Login);
