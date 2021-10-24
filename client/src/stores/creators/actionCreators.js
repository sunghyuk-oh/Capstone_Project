import * as actionTypes from '../actions/actionTypes';

// Home Component Actions
export const addSpace = (data, history) => {
  fetch('https://safe-anchorage-12116.herokuapp.com/spaces/createSpace', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/viewSpace/${data.userID}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${data.token}` }
  })
    .then((response) => response.json())
    .then((mySpaces) => {
      setAllSpaces(mySpaces);
    });
};

export const loadInvites = (data, setPendingSpace) => {
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/viewInvites/${data.userID}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${data.token}` }
  })
    .then((response) => response.json())
    .then((myInvites) => {
      setPendingSpace(myInvites);
    });
};

export const acceptSpaceInvite = (IDs, setPendingMsg, setPendingSpace, setAllSpaces) => {
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/acceptSpaceInvite`, {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/declineSpaceInvite`, {
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
    fetch('https://safe-anchorage-12116.herokuapp.com/users/login', {
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
    fetch('https://safe-anchorage-12116.herokuapp.com/users/register', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/auth/${data.spaceID}/${data.userID}`)
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/spaces/displayMembers/${data}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        updateState(result.members);
      }
    })
    .catch((err) => console.log(err));
};

export const invite = (data, setInviteMsg) => {
  fetch('https://safe-anchorage-12116.herokuapp.com/spaces/invite', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/events/displayAllEvents/${spaceID}`)
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
  fetch('https://safe-anchorage-12116.herokuapp.com/events/createEvent', {
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
    `https://safe-anchorage-12116.herokuapp.com/events/displayAllEventAttendees/${eventID}/${spaceID}`
  )
    .then((response) => response.json())
    .then((result) => {
      setEventAttendees(result.allAttendees);
    });
};

export const inviteMember = (invitee, setAttendees, setEventInviteMsg) => {
  fetch('https://safe-anchorage-12116.herokuapp.com/events/inviteMember', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/accounts/displayUserInfo/${userID}`, {
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
  fetch('https://safe-anchorage-12116.herokuapp.com/accounts/updateUserInfo', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/posts/displayAllPosts/${spaceID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setPosts(result.allPosts);
      }
    })
    .catch((err) => console.log(err));
};

export const onPost = (post, setPost) => {
  fetch('https://safe-anchorage-12116.herokuapp.com/posts/savePost', {
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
  fetch(`https://safe-anchorage-12116.herokuapp.com/posts/DisplayAllComments/${postID}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setAllComments(result.allComments);
      }
    });
};

export const saveAndDisplayComments = (comment, setAllComments, setPosts) => {
  fetch('https://safe-anchorage-12116.herokuapp.com/posts/saveAndDisplayComments', {
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
  fetch('https://safe-anchorage-12116.herokuapp.com/posts/incrementLike', {
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
