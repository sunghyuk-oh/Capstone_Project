import * as actionTypes from '../actions/actionTypes';

// Home Component Actions
export const addSpace = (data, history) => {
  fetch('http://localhost:8080/spaces/createSpace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        history.push({
          pathname: `/space/${result.spaceID}/${result.spaceName}`
        });
      }
    })
    .catch((err) => console.log(err));
};

export const loadSpaces = (data) => {
  return (dispatch) => {
    fetch(`http://localhost:8080/spaces/viewSpace/${data.userID}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${data.token}` }
    })
      .then((response) => response.json())
      .then((mySpaces) => {
        dispatch({ type: actionTypes.VIEW_MY_SPACE, payload: mySpaces });
      });
  };
};

export const loadInvites = (data) => {
  return (dispatch) => {
    fetch(`http://localhost:8080/spaces/viewInvites/${data.userID}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${data.token}` }
    })
      .then((response) => response.json())
      .then((myInvites) => {
        dispatch({ type: actionTypes.VIEW_MY_INVITES, payload: myInvites });
      });
  };
};

// Login Component Actions

export const login = (data, history) => {
  return (dispatch) => {
    fetch('http://localhost:8080/users/login', {
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
    fetch('http://localhost:8080/users/register', {
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
          dispatch({ type: actionTypes.ON_REGISTER, payload: result.success });
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
  fetch(`http://localhost:8080/spaces/auth/${data.spaceID}/${data.userID}`)
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
  fetch(`http://localhost:8080/spaces/displayMembers/${data}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        updateState(result.members);
      }
    })
    .catch((err) => console.log(err));
};

export const invite = (data) => {
  fetch('http://localhost:8080/spaces/invite', {
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

// Event Component Actions
export const displayAllEvents = (spaceID, setAllEvents) => {
  fetch(`http://localhost:8080/events/displayAllEvents/${spaceID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAllEvents(result.all_events);
      } else {
        console.log('Displaying all events failed.');
      }
    })
    .catch((err) => console.log(err));
};

export const addNewEvent = (event, setEvents) => {
  fetch('http://localhost:8080/events/createEvent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log(result.all_events);
        setEvents(result.all_events);
      } else {
        console.log('Adding a new event failed');
      }
    })
    .catch((err) => console.log(err));
};

export const displayAllAttendees = (eventID, spaceID, setEventAttendees) => {
  fetch(
    `http://localhost:8080/events/displayAllEventAttendees/${eventID}/${spaceID}`
  )
    .then((response) => response.json())
    .then((result) => {
      setEventAttendees(result.allAttendees);
    });
};

export const inviteMember = (invitee, setAttendee) => {
  fetch('http://localhost:8080/events/inviteMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitee)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAttendee(result.allAttendees);
      } else {
        console.log('Adding an attendee to this event failed');
      }
    })
    .catch((err) => console.log(err));
};

// User Account Component
export const displayUserInfo = (userID, userToken, setUserInfo) => {
  fetch(`http://localhost:8080/accounts/displayUserInfo/${userID}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` }
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setUserInfo(result.user);
      }
    })
    .catch((err) => console.log(err));
};

export const updateUserInfo = (userInfo) => {
  fetch('http://localhost:8080/accounts/updateUserInfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log(result.message);
      }
    })
    .catch((err) => console.log(err));
};

// Post component
export const displayAllPosts = (spaceID, setPosts) => {
  fetch(`http://localhost:8080/posts/displayAllPosts/${spaceID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setPosts(result.allPosts);
      }
    })
    .catch((err) => console.log(err));
};

export const onPost = (post, setPost) => {
  fetch('http://localhost:8080/posts/savePost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setPost(result.allPosts);
      }
    })
    .catch((err) => console.log(err));
};

export const displayAllComments = (postID, setAllComments) => {
  fetch(`http://localhost:8080/posts/DisplayAllComments/${postID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAllComments(result.allComments);
      }
    });
};

export const saveAndDisplayComments = (comment, setAllComments, setPosts) => {
  fetch('http://localhost:8080/posts/saveAndDisplayComments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAllComments(result.comments);
        setPosts(result.allPosts);
      }
    })
    .catch((err) => console.log(err));
};

export const incrementLike = (postID, spaceID, setPosts) => {
  fetch('http://localhost:8080/posts/incrementLike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postID: postID, spaceID: spaceID })
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setPosts(result.allPosts);
      }
    })
    .catch((err) => console.log(err));
};
