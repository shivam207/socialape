import React, { useState, Fragment, useEffect } from "react";
import MyButton from "../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import PostComment from "./PostComment";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import UnfoldMore from "@material-ui/icons/UnfoldMore";
import CommentIcon from "@material-ui/icons/Comment";

import { useDispatch, useSelector } from "react-redux";
import { getScream } from "../redux/actions/dataAction";

const useStyles = makeStyles((theme) => ({
  screamImage: {
    height: "150px",
    objectFit: "cover",
    borderRadius: "50%",
  },
  createdAt: {
    color: "gray",
  },
  body: {
    marginTop: "5px",
  },
  expandBtn: {
    position: "absolute",
    left: "90%",
  },
}));

function ScreamDialog({ screamId, handle, openDialog }) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState({});
  const dispatch = useDispatch();
  const classes = useStyles({});

  const scream = useSelector((state) => state.data.scream);
  const loading = useSelector((state) => state.UI.loading);

  useEffect(() => {
    console.log("Dialog - USe effect");
    if (openDialog) handleOpen();
  }, [openDialog]);

  const handleOpen = () => {
    let oldPath = window.location.pathname;
    let newPath = `/user/${handle}/scream/${screamId}`;

    // If user comes directly to the scream, then oldPath == newPath, Go to user page in that case
    if (oldPath === newPath) oldPath = `/user/${handle}`;
    window.history.pushState(null, null, newPath);
    setPath({ oldPath, newPath });
    setOpen(true);
    dispatch(getScream(screamId));
  };

  const handleClose = () => {
    window.history.pushState(null, null, path.oldPath);
    setOpen(false);
  };
  return (
    <Fragment>
      <MyButton
        tip="More details"
        onClick={handleOpen}
        btnClassName={classes.expandBtn}
      >
        <UnfoldMore></UnfoldMore>
      </MyButton>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          {loading ? (
            <CircularProgress size={50}></CircularProgress>
          ) : (
            <Fragment>
              <Grid container spacing={30}>
                <Grid item sm={4}>
                  <img
                    src={scream.userImage}
                    alt="scream-owner-img"
                    className={classes.screamImage}
                  ></img>
                </Grid>
                <Grid item sm={8}>
                  <Typography
                    variant="h5"
                    color="primary"
                    component={Link}
                    to={`/user/${scream.handle}`}
                  >
                    {scream.handle}
                  </Typography>

                  <Typography variant="body2" className={classes.createdAt}>
                    {dayjs(scream.createdAt).format("HH:MM A DD MMM YYYY")}
                  </Typography>
                  <Typography variant="body1" className={classes.body}>
                    {scream.body}
                  </Typography>
                  <LikeButton
                    screamId={screamId}
                    likesCount={scream.likesCount}
                  ></LikeButton>
                  <MyButton tip="Comment">
                    <CommentIcon></CommentIcon>
                  </MyButton>
                  <span>{scream.commentCount} comments</span>
                </Grid>
              </Grid>
              <hr></hr>
              <PostComment screamId={screamId}></PostComment>
              <Comments comments={scream.comments}></Comments>
            </Fragment>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ScreamDialog;
