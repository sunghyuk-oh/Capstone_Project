import { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as actionCreators from '../stores/creators/actionCreators';

function Register(props) {
  const history = useHistory();
  const [userRegister, setUserRegister] = useState({});

  const handleRegisterInput = (e) => {
    setUserRegister({
      ...userRegister,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = () => {
    props.onRegister(userRegister, history);
    setUserRegister({});
  };

  return (
    <section id="register">
      <div id="registerCredentials">
        <h3>Register</h3>
        <input
          type="text"
          onChange={handleRegisterInput}
          name="firstName"
          placeholder="First Name"
          className="registerInputs"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="lastName"
          placeholder="Last Name"
          className="registerInputs"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="email"
          placeholder="Email"
          className="registerInputs"
        />
        <input
          type="text"
          onChange={handleRegisterInput}
          name="username"
          placeholder="Username"
          className="registerInputs"
        />
        <input
          type="password"
          onChange={handleRegisterInput}
          name="password"
          placeholder="Password"
          className="registerInputs"
        />
        <input
          type="password"
          onChange={handleRegisterInput}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="registerInputs"
        />
        <button id="registerBtn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRegister: (data, history) =>
      dispatch(actionCreators.register(data, history))
  };
};

export default connect(null, mapDispatchToProps)(Register);
