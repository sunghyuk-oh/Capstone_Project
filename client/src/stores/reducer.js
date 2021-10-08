const initialState = {
    isAuth: false
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case 'ON_LOGIN':
            return {
                ...state,
                isAuth: true
            }
        case 'ON_LOGOUT':
            return {
                ...state,
                isAuth: false
            }
        default:
            return state
    }
}

export default reducer