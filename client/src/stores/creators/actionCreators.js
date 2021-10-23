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

export const loadSpaces = (data, setAllSpaces) => {
  fetch(`http://localhost:8080/spaces/viewSpace/${data.userID}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${data.token}` }
  })
    .then((response) => response.json())
    .then((mySpaces) => {
      setAllSpaces(mySpaces);
    });
};

export const loadInvites = (data, setPendingSpace) => {
  fetch(`http://localhost:8080/spaces/viewInvites/${data.userID}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${data.token}` }
  })
    .then((response) => response.json())
    .then((myInvites) => {
      setPendingSpace(myInvites);
    });
};

export const acceptSpaceInvite = (IDs, setPendingMsg, setPendingSpace, setAllSpaces) => {
  fetch(`http://localhost:8080/spaces/acceptSpaceInvite`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(IDs)
  })
  .then(response => response.json())
  .then(result => {
    setAllSpaces(result.allSpaces)
    setPendingSpace(result.pendingSpaces)
    setPendingMsg({ isDisplay: true, message: result.message })
  })
}

export const declineSpaceInvite = (IDs, setDeclineMsg, setPendingSpace) => {
  fetch(`http://localhost:8080/spaces/declineSpaceInvite`, {
    method: "DELETE",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(IDs)
  })
  .then(response => response.json())
  .then(result => {
    setPendingSpace(result.pendingSpaces)
    setDeclineMsg({ isDisplay: true, message: result.message })
  })
}


// Login Component Actions
export const login = (data, history, setErrorMsg) => {
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
          setErrorMsg({ isDisplay: true, message: result.message})
        }
      })
      .catch((err) => console.log(err));
  };
};

export const register = (data, history, setErrorMsg) => {
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
          setErrorMsg({ isDisplay: true, message: result.message})
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

export const invite = (data, setInviteMsg) => {
  fetch('http://localhost:8080/spaces/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setInviteMsg({isDisplay: true, message: result.message})
      } else {
        setInviteMsg({isDisplay: true, message: result.message})
      }
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

export const inviteMember = (invitee, setAttendees, setEventInviteMsg) => {
  fetch('http://localhost:8080/events/inviteMember', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitee)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAttendees(result.allAttendees)
        setEventInviteMsg(result.message)
      } else {
        setEventInviteMsg(result.message)
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
