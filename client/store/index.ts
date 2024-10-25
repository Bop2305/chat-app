import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.duck";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
