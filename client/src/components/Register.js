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
    <section className="">
      <button>
        <NavLink to="/">Home</NavLink>
      </button>
      <div className="">
        <h3>Register</h3>
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
    onRegister: (data, history) =>
      dispatch(actionCreators.register(data, history))
  };
};

export default connect(null, mapDispatchToProps)(Register);
