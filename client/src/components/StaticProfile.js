import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: 10,
  },
  profileCard: {
    textAlign: "center",
    padding: "10px 10px 10px 10px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3px",
  },
  imageContainer: {
    position: "relative",
  },
}));

function StaticProfile(props) {
  const { handle, bio, website, location, createdAt, imageUrl } = props.user;
  const classes = useStyles();
  let profileMarkup = (
    <div>
      <Card className={classes.profileCard}>
        <div className={classes.imageContainer}>
          <img src={imageUrl} alt="profile" className="profile-image"></img>
        </div>

        <br></br>
        <Typography
          variant="h5"
          component={Link}
          to={`/user/${handle}`}
          className={classes.userInfo}
          color="primary"
        >
          @{handle}
        </Typography>
        <br></br>
        {location && (
          <Fragment>
            <Typography variant="body2" className={classes.userInfo}>
              <LocationOn color="primary"></LocationOn>
              <span> </span>
              {location}
            </Typography>
          </Fragment>
        )}
        {bio && (
          <Typography variant="body2" className={classes.userInfo}>
            {bio}
          </Typography>
        )}
        {website && (
          <Fragment>
            <Typography variant="body2" className={classes.userInfo}>
              <LinkIcon color="primary"></LinkIcon>
              <span> </span>
              <a href={website} target="_blank" rel="noopener noreferrer">
                {" "}
                {website}
              </a>
            </Typography>
          </Fragment>
        )}
        {
          <Typography variant="body2" className={classes.userInfo}>
            <CalendarToday color="primary"></CalendarToday>
            <span> Joined on {dayjs(createdAt).format("MMM YYYY")}</span>
          </Typography>
        }
      </Card>
    </div>
  );

  return profileMarkup;
}

export default StaticProfile;
