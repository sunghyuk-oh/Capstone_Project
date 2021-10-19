import * as actionTypes from '../stores/actions/actionTypes';

const initialState = {
  isAuth: false,
  mySpaceList: [],
  allEvents: [],
  posts: []
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
    case actionTypes.DISPLAY_ALL_EVENTS:
      return {
        ...state,
        allEvents: action.payload
      }
    case actionTypes.DISPLAY_POSTS:
      return {
        ...state,
        posts: action.payload
      }
    // case actionTypes.ON_POST:
    //   return {
      // state.posts.concat(action.payload)
    // }
    default:
      return state;
  }
};

export default reducer;
