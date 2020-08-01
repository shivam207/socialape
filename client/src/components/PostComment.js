import React, { useState } from "react";
import MyButton from "../util/MyButton";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";

import SendIcon from "@material-ui/icons/Send";

import { postComment } from "../redux/actions/dataAction";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  comment: {
    width: "100%",
    padding: "2px 4px",
    marginBottom: "20px",
  },
  commentBody: {
    width: "90%",
  },
}));

function PostComment({ screamId }) {
  const [body, setBody] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();

  let authenticated = useSelector((state) => state.user.authenticated);
  let errors = useSelector((state) => state.UI.errors);

  const handleChange = (event) => {
    setBody(event.target.value);
  };

  const handleSend = () => {
    console.log("Comment Sent");
    dispatch(postComment(screamId, { body: body }));
  };
  return authenticated ? (
    <Paper component="form" className={classes.comment}>
      <InputBase
        name="body"
        placeholder="Post a Comment"
        onChange={handleChange}
        value={body}
        className={classes.commentBody}
        error={errors.message ? true : false}
      ></InputBase>
      <MyButton tip="Comment" onClick={handleSend}>
        <SendIcon></SendIcon>
      </MyButton>
    </Paper>
  ) : null;
}

export default PostComment;
