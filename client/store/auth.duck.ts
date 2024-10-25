import { Dispatch, Reducer } from "@reduxjs/toolkit";
import authService, { SignInDto, SignUpDto } from "./auth.service";

type StateTypes = {
  authenticate: boolean;
  loading: boolean;
  error: string;
};

const GET_AUTHENTICATE = "auth/GET_AUTHENTICATE";
const SET_AUTHENTICATE = "auth/SET_AUTHENTICATE";
const SIGN_IN_REQUEST = "auth/SIGN_IN_REQUEST";
const SIGN_IN_SUCCESS = "auth/SIGN_IN_SUCCESS";
const SIGN_IN_FAILURE = "auth/SIGN_IN_FAILURE";
const SIGN_UP_REQUEST = "auth/SIGN_UP_REQUEST";
const SIGN_UP_SUCCESS = "auth/SIGN_UP_SUCCESS";
const SIGN_UP_FAILURE = "auth/SIGN_UP_FAILURE";

const initialState: StateTypes = {
  authenticate: false,
  loading: false,
  error: "",
};

export const setAuthenticate = (authenticate: boolean) => {
  return {
    type: SET_AUTHENTICATE,
    payload: authenticate,
  };
};

export const signIn =
  ({ email, password }: SignInDto, callback: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({
      type: SIGN_IN_REQUEST,
      payload: true,
    });

    try {
      const res = await authService.signIn({ email, password });

      dispatch({
        type: SIGN_IN_SUCCESS,
        payload: true,
      });

      dispatch({
        type: SIGN_IN_FAILURE,
        payload: "",
      });

      localStorage.setItem("token", res?.accessToken);
      callback();
    } catch (error) {
      dispatch({
        type: SIGN_IN_FAILURE,
        payload: "Sign In Failed",
      });
    } finally {
      dispatch({
        type: SIGN_IN_REQUEST,
        payload: false,
      });
    }
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

    case SIGN_IN_REQUEST:
      return {
        ...state,
        loading: action.payload,
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        authenticate: action.payload,
      };

    case SIGN_IN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
