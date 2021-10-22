import * as actionTypes from '../stores/actions/actionTypes';

const initialState = {
  isAuth: false,
  mySpaceList: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ON_LOGIN:
      return {
        ...state,
        isAuth: true
      };
    case actionTypes.ON_REGISTER:
      return {
        ...state,
        isAuth: true
      };
    case actionTypes.ON_LOGOUT:
      return {
        ...state,
        isAuth: false
      };
    case actionTypes.VIEW_MY_SPACE:
      return {
        ...state,
        mySpaceList: action.payload
      };
    case actionTypes.DELETE_MY_SPACE:
      return {
        mySpaceList: []
      };
    default:
      return state;
  }
};

export default reducer;
