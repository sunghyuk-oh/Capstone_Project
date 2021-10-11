import { NavLink } from 'react-router-dom'

function Menu() {
    return(
        <nav>
            <div>
                <button>Logout</button>
                <NavLink to='/profile'>Profile</NavLink>
            </div>
        </nav>
    )
}

export default Menu