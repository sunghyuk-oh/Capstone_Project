import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <section id="landing">
      <nav id="landingNav">
        <NavLink id="loginLink" className="landingLink" to="/login">
          Login
        </NavLink>
        <NavLink id="registerLink" className="landingLink" to="/register">
          Register
        </NavLink>
      </nav>
    </section>
  );
};

export default Landing;
