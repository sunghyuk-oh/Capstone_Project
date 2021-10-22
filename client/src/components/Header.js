import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import logo2 from '../images/Gather-logo2.png';

const Header = (props) => {
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
        ) : null}
      </nav>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth
  };
};

export default connect(mapStateToProps)(Header);
