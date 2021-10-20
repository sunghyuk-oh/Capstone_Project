import Header from './Header';
import '../css/output.css';

function App(props) {
  return (
    <main id="baseLayout">
      <div id="secondLayerContainer">
        <Header />
        {props.children}
      </div>
    </main>
  );
}

export default App;
