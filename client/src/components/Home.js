import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Main(props) {
    return (
        <article className="App">
            <section className="">
                <h1>FriendsZone</h1>
                <div className="">
                    { !props.isAuth ? <NavLink to="/login">Login / Register</NavLink> : null}
                    { props.isAuth ? <NavLink to="/logout">Logout</NavLink> : null}
                    { props.isAuth ? <NavLink to="/zone">View My Zone</NavLink> : null}
                </div>
            </section>

            <section className="">
                <img src="" />
            </section>

        </article>
      )
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth
    }
} 

export default connect(mapStateToProps)(Main)