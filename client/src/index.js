import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import reducer from './stores/reducer';
import App from './components/App';
import Landing from './components/Landing';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Space from './components/Space';
import requireAuth from './components/requireAuth';
import Register from './components/Register';
import io from 'socket.io-client';
import Account from './components/Account';

window.socket = io.connect('https://gather.surge.sh');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

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
            <Route exact path="/" component={Landing} />
            <Route path="/home" component={requireAuth(Home)} />
            <Route path="/account" component={requireAuth(Account)} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/logout" component={Logout} />
            <Route
              exact
              path="/space/:spaceid/:spacename"
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
