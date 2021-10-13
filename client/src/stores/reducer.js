const initialState = {
    isAuth: false,
    mySpaceList: []
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
        case 'VIEW_MY_SPACE':
            return {
                ...state,
                mySpaceList: action.payload
            }
        case 'DELETE_MY_SPACE':
            return {
                mySpaceList: []
            }
        default:
            return state
    }
}

export default reducer