import { createContext, useEffect, useReducer, useCallback, useState } from "react";
// import { baseUrl, postRequest, getRequest } from "../Utils/servise.js";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [user, setUser] = useState(null);

  const [registerInfo, setRegisterInfo] = useState({
    username: '',
    email: '',
    password: '',
    repassword: ''
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo((prevInfo) => ({
      ...prevInfo,
      ...info,
    }));
  }, []);

  const updateUser = useCallback((response) => {
    localStorage.setItem("user", JSON.stringify(response));
    setUser(response);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        registerInfo,
        updateRegisterInfo,
        dispatch,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};