import { useState, useEffect } from 'react'
import * as actionCreators from '../stores/creators/actionCreators'

function Account() {
    const userID = localStorage.getItem('userID')
    const userToken = localStorage.getItem('userToken')
    const [userInfo, setUserInfo] = useState({})
    const [isToggle, setIsToggle] = useState(false)

    useEffect(() => {
        actionCreators.displayUserInfo(userID, userToken, setUserInfo)
    }, [])
    
    
    const handleUpdateInputToggle = () => {
        !isToggle ? setIsToggle(true) : setIsToggle(false) 
    }


    const handleInputUpdate = (e) => {
        setUserInfo({
            ...userInfo, 
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateUserInfo = () => {
        actionCreators.updateUserInfo(userInfo)
        setIsToggle(false)
    }

    return (
        <div>
            <h2>User Information</h2>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>First Name:</strong> {userInfo.first_name}</p>
            <p><strong>Last Name:</strong> {userInfo.last_name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <button onClick={handleUpdateInputToggle}>Update</button>
            {isToggle ? (
                <div>
                    First Name: <input type="text" name="first_name" placeholder={userInfo.first_name} onChange={handleInputUpdate} />
                    Last Name: <input type="text" name="last_name" placeholder={userInfo.last_name} onChange={handleInputUpdate} />
                    Email: <input type="text" name="email" placeholder={userInfo.email} onChange={handleInputUpdate} />
                    <button onClick={handleUpdateUserInfo}>Update</button>
                </div>
            ): null}
        </div>
    )
}

export default Account