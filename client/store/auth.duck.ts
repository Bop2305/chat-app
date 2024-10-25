import { Dispatch, Reducer } from "@reduxjs/toolkit";
import authService, { SignInDto } from "./auth.service";

type StateTypes = {
  authenticate: boolean;
  loading: boolean;
  error: string;
};

const GET_AUTHENTICATE = "auth/GET_AUTHENTICATE";
const SIGN_IN_REQUEST = "auth/SET_AUTHENTICATE_REQUEST";
const SIGN_IN_SUCCESS = "auth/SET_AUTHENTICATE_SUCCESS";
const SIGN_IN_FAILURE = "auth/SET_AUTHENTICATE_FAILURE";

const initialState: StateTypes = {
  authenticate: false,
  loading: false,
  error: "",
};

export const signIn =
  ({ userName, password }: SignInDto) =>
  async (dispatch: Dispatch) => {
    dispatch({
      type: SIGN_IN_REQUEST,
      payload: true,
    });

    try {
      const res = await authService.signIn({ userName, password });

      dispatch({
        type: SIGN_IN_SUCCESS,
        payload: true,
      });

      dispatch({
        type: SIGN_IN_FAILURE,
        payload: "",
      });

      // localStorage.setItem("token", res?.token)
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
