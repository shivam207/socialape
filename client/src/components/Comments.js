import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  commentImage: {
    width: 80,
    objectFit: "cover",
    borderRadius: "50%",
  },
  visibleSeperator: {
    width: "100%",
  },
  invisibleSeperator: {
    border: "none",
  },
}));

function Comments({ comments }) {
  const classes = useStyles();
  return comments ? (
    <Grid container spacing={20}>
      {comments.map((comment, index) => (
        <Fragment>
          <Grid container spacing={20}>
            <Grid item sm={3}>
              <img
                src={comment.imageUrl}
                alt="comment-user"
                className={classes.commentImage}
              ></img>
            </Grid>
            <Grid item sm={9}>
              <Typography
                variant="h5"
                color="primary"
                component={Link}
                to={`/user/${comment.handle}`}
              >
                {comment.handle}
              </Typography>

              <Typography variant="body2" className={classes.createdAt}>
                {dayjs(comment.createdAt).format("HH:MMA DD MMM YYYY")}
              </Typography>
              <hr className={classes.invisibleSeperator}></hr>
              <Typography variant="body1">{comment.body}</Typography>
            </Grid>
          </Grid>
          {index === comments.length - 1 ? null : (
            <hr className={classes.visibleSeperator}></hr>
          )}
        </Fragment>
      ))}
    </Grid>
  ) : null;
}

export default Comments;
