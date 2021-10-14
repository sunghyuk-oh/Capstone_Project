import * as actionTypes from '../actions/actionTypes';

// Home Component Actions
export const addSpace = (data, history) => {
  fetch('http://localhost:8080/createSpace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        history.push({
          pathname: `/space/${result.spaceID}`,
          state: { spaceName: data.spaceName, spaceID: result.spaceID }
        });
      }
    })
    .catch((err) => console.log(err));
};

export const loadSpaces = (data) => {
  return (dispatch) => {
    fetch(`http://localhost:8080/viewSpace/${data.userID}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${data.token}` }
    })
      .then((response) => response.json())
      .then((mySpaces) => {
        dispatch({ type: actionTypes.VIEW_MY_SPACE, payload: mySpaces });
      });
  };
};

// Login Component Actions

export const login = (data, history) => {
  return (dispatch) => {
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          localStorage.setItem('userToken', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('userID', result.userID);
          dispatch({ type: 'ON_LOGIN', payload: result.success });
          history.push('/home');
        } else {
          console.log('Login Failed');
        }
      })
      .catch((err) => console.log(err));
  };
};

export const register = (data, history) => {
  return (dispatch) => {
    fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          localStorage.setItem('userToken', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('userID', result.userID);
          dispatch({ type: 'ON_REGISTER', payload: result.success });
          history.push('/home');
        } else {
          console.log('Registration Failed');
        }
      })
      .catch((err) => console.log(err));
  };
};

// Space Component Actions
export const authUsers = (data, history) => {
  fetch(`http://localhost:8080/auth/${data.spaceID}/${data.userID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log(result.message);
      } else {
        // redirect to a message component
        history.push('/home');
        console.log(result.message);
      }
    })
    .catch((err) => console.log(err));
};

export const listMembers = (data, updateState) => {
  fetch(`http://localhost:8080/displayMembers/${data}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        updateState(result.members);
      }
    })
    .catch((err) => console.log(err));
};

export const invite = (data) => {
  fetch('http://localhost:8080/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};
