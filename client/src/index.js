import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import reducer from './stores/reducer';
import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import SocketIo from './components/SocketioTest';
import Space from './components/Space';
import requireAuth from './components/requireAuth';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const token = localStorage.getItem('userToken');
if (token) {
  store.dispatch({ type: 'ON_LOGIN' });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/test" component={SocketIo} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route
              exact
              path="/space/:spaceid"
              component={requireAuth(Space)}
            />
          </Switch>
        </App>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
