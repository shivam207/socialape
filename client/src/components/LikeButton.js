import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MyButton from "../util/MyButton";

import { useSelector, useDispatch } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataAction";

import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";

function LikeButton({ screamId, likesCount }) {
  const dispatch = useDispatch();

  const { authenticated, likes } = useSelector((state) => state.user);

  const likedScream = () => {
    console.log(likes);
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].screamId === screamId) return true;
      }
    }

    return false;
  };

  const handleLike = () => {
    console.log("like clicked.", screamId);
    dispatch(likeScream(screamId));
  };

  const handleUnlike = () => {
    dispatch(unlikeScream(screamId));
  };

  const likeMarkup = !authenticated ? (
    <Fragment>
      <Link to="/login">
        <MyButton tip="Like Scream">
          <FavoriteBorder></FavoriteBorder>
        </MyButton>
      </Link>

      <span>{likesCount} likes</span>
    </Fragment>
  ) : likedScream() ? (
    <Fragment>
      <MyButton tip="Undo like" onClick={handleUnlike}>
        <Favorite></Favorite>
      </MyButton>
      <span>{likesCount} likes</span>
    </Fragment>
  ) : (
    <Fragment>
      <MyButton tip="Like Scream" onClick={handleLike}>
        <FavoriteBorder></FavoriteBorder>
      </MyButton>
      <span>{likesCount} likes</span>
    </Fragment>
  );
  return likeMarkup;
}

export default LikeButton;
