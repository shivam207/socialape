import {
  LOADING_DATA,
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  LOADING_UI,
  CLEAR_ERRORS,
  STOP_LOADING_UI,
  SET_SCREAM,
  POST_COMMENT,
} from "../types";
import axios from "axios";

export const getScreams = () => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get("/screams")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: SET_SCREAMS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getScream = (screamId) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data,
      });
      dispatch({
        type: STOP_LOADING_UI,
      });
    })
    .catch((err) => console.log(err));
};

export const likeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/like`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const unlikeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const deleteScream = (screamId) => (dispatch) => {
  axios
    .delete(`scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: DELETE_SCREAM,
        payload: screamId,
      });
    })
    .catch((err) => console.log(err));
};

export const postScream = (scream) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/scream", { body: scream })
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: POST_SCREAM,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const postComment = (screamId, comment) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/scream/${screamId}/comment`, comment)
    .then((res) => {
      dispatch({
        type: POST_COMMENT,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
