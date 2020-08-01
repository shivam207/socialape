import {
  LOADING_DATA,
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  POST_COMMENT,
} from "../types";

const initialState = {
  loading: false,
  screams: [],
  scream: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        loading: false,
        screams: action.payload,
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      return {
        ...state,
        screams: [
          ...state.screams.slice(0, index),
          action.payload,
          ...state.screams.slice(index + 1),
        ],
        scream: {
          ...state.scream,
          ...action.payload,
        },
      };
    case DELETE_SCREAM:
      let deleteIndex = state.screams.findIndex(
        (scream) => scream.screamId === action.payload
      );
      return {
        ...state,
        screams: [
          ...state.screams.slice(0, deleteIndex),
          ...state.screams.slice(deleteIndex + 1),
        ],
      };
    case POST_SCREAM:
      return {
        ...state,
        loading: false,
        screams: [action.payload, ...state.screams],
      };

    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
      };
    case POST_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
        },
      };
    default:
      console.log("Default data reducer called");
      return state;
  }
}
