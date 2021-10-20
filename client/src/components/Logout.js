import { useEffect } from 'react'
import { connect } from 'react-redux' 

function Logout(props) {
    useEffect(() => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('username')
        localStorage.removeItem('userID')
        props.onLogout()
        props.onDeleteSpaceList()
        props.history.push('/')
    }, [])

    return (
        <section>
        
        </section>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => dispatch({type: 'ON_LOGOUT'}),
        onDeleteSpaceList: () => dispatch({type: 'DELETE_MY_SPACE'})
    }
}

export default connect(null, mapDispatchToProps)(Logout)