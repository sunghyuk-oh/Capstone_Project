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
      <div id="siteInfo">
        <h2>Welcome To Gather</h2>
        <h3>
          We are a social media site where you can create Gathering Spaces for
          you and your friends
        </h3>
        <h4>
          You can post messages, chat, create events just for your inner circle
        </h4>
        <h4>Keep it in your circle, and Gather today!</h4>
      </div>
    </section>
  );
};

export default Landing;
