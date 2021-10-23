import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo2 from '../images/Gather-logo2.png';
import * as actionCreators from '../stores/creators/actionCreators';

const Header = (props) => {
  const history = useHistory();

  const handleGuestLogin = () => {
    const guest = {username: 'guest', password: 'guest123'}
    props.onLogin(guest, history, {});
  }

  return (
    <header id="header">
      <nav id="headerNav">
        {props.isAuth ? (
          <NavLink to="/home">
            <img id="logo2" src={logo2} alt="Gather Header Logo" />
          </NavLink>
        ) : (
          <NavLink to="/">
            <img id="logo2" src={logo2} alt="Gather Header Logo" />
          </NavLink>
        )}
        {props.isAuth ? (
          <div className="authBtns">
            <button id="logout">
              <NavLink to="/logout">Logout</NavLink>
            </button>
            <button id="userAccount">
              <NavLink to="/account">User Account</NavLink>
            </button>
          </div>
        ) : (
          <div className="authBtns">
            <button id="guest" onClick={handleGuestLogin}>
              Login as guest
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data, history, setErrorMsg) => dispatch(actionCreators.login(data, history, setErrorMsg))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
