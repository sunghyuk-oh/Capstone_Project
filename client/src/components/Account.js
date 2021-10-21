import { useState, useEffect } from 'react';
import * as actionCreators from '../stores/creators/actionCreators';

function Account() {
  const userID = localStorage.getItem('userID');
  const userToken = localStorage.getItem('userToken');
  const [userInfo, setUserInfo] = useState({});
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    actionCreators.displayUserInfo(userID, userToken, setUserInfo);
  }, []);

  const handleUpdateInputToggle = () => {
    !isToggle ? setIsToggle(true) : setIsToggle(false);
  };

  const handleInputUpdate = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUserInfo = () => {
    actionCreators.updateUserInfo(userInfo);
    setIsToggle(false);
  };

  return (
    <section id="userAcct">
      <h2>User Information</h2>
      <div id="userInfo">
        <span className="userData">
          <strong>Username:</strong> {userInfo.username}
        </span>
        <span className="userData">
          <strong>First Name:</strong> {userInfo.first_name}
        </span>
        <span className="userData">
          <strong>Last Name:</strong> {userInfo.last_name}
        </span>
        <span className="userData">
          <strong>Email:</strong> {userInfo.email}
        </span>
        <button id="userUpdateBtn" onClick={handleUpdateInputToggle}>
          Update
        </button>
      </div>
      {isToggle ? (
        <div id="userUpdates">
          <h3>Update Your Information Below:</h3>
          First Name:{' '}
          <input
            type="text"
            className="updateInput"
            name="first_name"
            placeholder={userInfo.first_name}
            onChange={handleInputUpdate}
          />
          Last Name:{' '}
          <input
            type="text"
            className="updateInput"
            name="last_name"
            placeholder={userInfo.last_name}
            onChange={handleInputUpdate}
          />
          Email:{' '}
          <input
            type="text"
            className="updateInput"
            name="email"
            placeholder={userInfo.email}
            onChange={handleInputUpdate}
          />
          <button id="updateSubmit" onClick={handleUpdateUserInfo}>
            Submit
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default Account;
