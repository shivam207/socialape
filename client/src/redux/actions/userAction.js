import {
  SET_USER,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  MARK_NOTIFICATION_READ,
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      // Get the token after login
      console.log(res.data);
      localStorage.setItem("social-ape-token", `Bearer ${res.data.token}`);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS,
      });
      // Redirect to Home page on Successfull login
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      // Get the token after login
      console.log(res.data);
      localStorage.setItem("social-ape-token", `Bearer ${res.data.token}`);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS,
      });
      // Redirect to Home page on Successfull login
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("social-ape-token");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({
    type: SET_UNAUTHENTICATED,
  });
};

export const getUserData = () => (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (formData) => (dispatch) => {
  console.log("In Upload IMage action");
  dispatch({
    type: LOADING_USER,
  });
  axios
    .post("/user/image", formData)
    .then((res) => {
      console.log(res.data);
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editProfile = (profileDetails) => (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  axios
    .post("/user", profileDetails)
    .then((res) => {
      console.log(res.data);
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationRead = (notificationIds) => (dispatch) => {
  axios
    .post("/notification", notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATION_READ,
      });
    })
    .catch((err) => console.log(err));
};
