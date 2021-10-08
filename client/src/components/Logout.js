import { useEffect } from 'react'
import { connect } from 'react-redux' 

function Logout(props) {
    useEffect(() => {
        localStorage.removeItem('userToken')
        props.onLogout()
        props.history.push('/')
    }, [])

    return (
        <section>
        
        </section>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => dispatch({type: 'ON_LOGOUT'})
    }
}

export default connect(null, mapDispatchToProps)(Logout)