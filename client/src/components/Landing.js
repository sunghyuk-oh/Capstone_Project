import { NavLink } from 'react-router-dom';
import logo1 from '../images/Gather-logo1.png';

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
      <div id="bodyLogo">
        <img id="logo1" src={logo1} alt="Gather Main Logo"></img>
      </div>
    </section>
  );
};

export default Landing;
