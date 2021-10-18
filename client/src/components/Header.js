import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

const Header = (props) => {
  return (
    <header id="header">
      <nav id="headerNav">
        {props.isAuth ? (
          <NavLink to="/home">Logo</NavLink>
        ) : (
          <NavLink to="/">Logo</NavLink>
        )}
        <h2>Gather</h2>
        {props.isAuth ? (
          <button>
            <NavLink to="/logout">Logout</NavLink>
          </button>
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
