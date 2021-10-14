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
