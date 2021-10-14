import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <main id="landing">
      <h1>FriendsZone</h1>
      <section className="">
        <div className="">
          <button>
            <NavLink to="/login">Login / Register</NavLink>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Landing;
