import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from "../util/MyButton";
import DeleteButton from "./DeleteButton";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
// MUI STUFF
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Redux
import { useSelector } from "react-redux";

import Comment from "@material-ui/icons/Comment";

const useStyles = makeStyles({
  card: {
    marginBottom: 20,
    display: "flex",
    position: "relative",
  },
  media: {
    minWidth: 100,
    objectFit: "cover",
  },
  createdDate: {
    color: "gray",
  },
});

function Scream({ scream, openDialog }) {
  const classes = useStyles({});
  const {
    userImage,
    body,
    commentCount,
    likesCount,
    createdAt,
    handle,
    screamId,
  } = scream;

  const {
    authenticated,
    credentials: { handle: userHandle },
  } = useSelector((state) => state.user);

  dayjs.extend(relativeTime);

  return (
    <Card className={classes.card}>
      <CardMedia
        image={userImage}
        title="Contemplative Reptile"
        className={classes.media}
      />
      <CardContent>
        <Typography
          variant="h6"
          component={Link}
          to={`/user/${handle}`}
          color="primary"
        >
          {handle}
        </Typography>
        {/* Show Delete Scream button for only authenticated user and their screams */}
        {authenticated ? (
          userHandle === handle ? (
            <DeleteButton screamId={screamId}></DeleteButton>
          ) : null
        ) : null}

        <Typography variant="body2" className={classes.createdDate}>
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        {/* Like and Comment Button */}
        <LikeButton screamId={screamId} likesCount={likesCount}></LikeButton>
        <MyButton tip="Comment">
          <Comment></Comment>
        </MyButton>
        <span>{commentCount} comments</span>
        <ScreamDialog
          screamId={screamId}
          handle={handle}
          openDialog={openDialog}
        ></ScreamDialog>
      </CardContent>
    </Card>
  );
}

export default Scream;
