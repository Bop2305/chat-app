import { Reducer } from "@reduxjs/toolkit";

type StateTypes = {
  authenticate: boolean;
};

const GET_AUTHENTICATE = "auth/GET_AUTHENTICATE";
const SET_AUTHENTICATE = "auth/SET_AUTHENTICATE";

const initialState: StateTypes = {
  authenticate: false,
};

const setAuthenticate = (authenticate: boolean) => {
  return {
    type: SET_AUTHENTICATE,
    payload: authenticate,
  };
};

const authReducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTHENTICATE:
      return state?.authenticate;

    case SET_AUTHENTICATE:
      return {
        ...state,
        authenticate: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
