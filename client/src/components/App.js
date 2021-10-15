import Header from './Header';
import '../css/output.css';

function App(props) {
  return (
    <main id="baseLayout">
      <Header />
      {props.children}
    </main>
  );
}

export default App;
