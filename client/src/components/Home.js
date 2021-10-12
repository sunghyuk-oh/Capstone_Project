import { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function Main(props) {
    const history = useHistory();
    const [newSpace, setNewSpace] = useState(false);
    const [spaceName, setSpaceName] = useState('');

    const handleNewSpaceInputPopUp = () => {
        newSpace ? setNewSpace(false) : setNewSpace(true);
    };

    const handleSpaceName = (e) => {
        setSpaceName(e.target.value);
    };


    const handleCreateSpace = () => {
        const userID = localStorage.getItem('userID');

        fetch('http://localhost:8080/createSpace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaceName: spaceName, userID: userID })
        })
            .then((response) => response.json())
            .then((result) => {
            if (result.success) {
                // sending space name variable to space component (for invites)
                history.push({
                pathname: `/space/${result.spaceID}`,
                state: { spaceName: spaceName, spaceID: result.spaceID }
                });
            }
            })
            .catch((err) => console.log(err));
    };


    const handleViewSpace = () => {
        const token = localStorage.getItem('userToken')
        const userID = localStorage.getItem('userID')
        
        fetch(`http://localhost:8080/viewSpace/${userID}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        })
        .then(response => response.json())
        .then(mySpaces => {
            props.onViewMySpace(mySpaces)
        })
    }


    const allMySpace = props.mySpaceList.map((space) => {
        return (
            <div key={space.space_id} className="eachSpace">
                <h3>{space.space_name}</h3>
                <button>
                    <NavLink to={{
                        pathname: `/space/${space.space_id}`,
                        state: {spaceID: space.space_id, spaceName: space.space_name}
                        }    
                    }>Go To Space</NavLink>
                </button>
            </div>
        )
    })

    return (
        <article className="App">
            <h1>FriendsZone</h1>
            <section className="">
                <div className="">
                    { !props.isAuth ? (
                        <button>
                            <NavLink to="/login">Login / Register</NavLink>
                        </button>
                    ) : null }
                    { props.isAuth ? (
                        <button>
                            <NavLink to="/logout">Logout</NavLink>
                        </button>
                    ) : null }
                    { props.isAuth ? (
                        <button onClick={handleNewSpaceInputPopUp}>Create New Space</button>
                    ) : null }
                    { props.isAuth && newSpace ? (
                        <div className="">
                            <input type="text" onChange={handleSpaceName} placeholder="Enter Space Name" />
                            <button onClick={handleCreateSpace}>Create</button>
                        </div>
                    ) : null }
                    { props.isAuth ? (
                        <button onClick={handleViewSpace}>View My Space</button>
                    ) : null }
                </div>
                <div className="">
                    <img src="" />
                </div>
            </section>
            <section className="">
                { props.isAuth ? 
                    <div className="">
                        {allMySpace}
                    </div>
                : null}
            </section>
        </article>
      )
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth,
        mySpaceList: state.mySpaceList
    }
} 

const mapDispatchToProps = (dispatch) => {
    return {
        onViewMySpace: (spaceList) => dispatch({ type: "VIEW_MY_SPACE", payload: spaceList })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)



