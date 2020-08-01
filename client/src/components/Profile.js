import React, { Fragment } from "react";

import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditProfile from "./EditProfile";

// MUI STUFF
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// MUI Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Edit from "@material-ui/icons/Edit";
import ExitToApp from "@material-ui/icons/ExitToApp";

// Redux
import { uploadImage, logoutUser } from "../redux/actions/userAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

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
  uploadBtn: {
    position: "absolute",
    bottom: 0,
  },
  logoutBtn: {
    float: "left",
  },
}));

function Profile() {
  const classes = useStyles();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    authenticated,
    loading,
    credentials: { createdAt, imageUrl, handle, bio, location, website },
  } = user;

  console.log("Profile..");
  console.log(user);

  const handleImageUpload = (event) => {
    console.log("Handle Upload");
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    // Dispatch Upload Image action
    dispatch(uploadImage(formData));
  };

  const editProfilePicture = () => {
    console.log("Upload Image.");
    const uploadImgBtn = document.getElementById("image");
    uploadImgBtn.click();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  let profileMarkup = authenticated ? (
    loading ? (
      <CircularProgress></CircularProgress>
    ) : (
      <div>
        <Card className={classes.profileCard}>
          <div className={classes.imageContainer}>
            <img src={imageUrl} alt="profile" className="profile-image"></img>
            <input
              id="image"
              type="file"
              onChange={handleImageUpload}
              hidden
            ></input>
            <Tooltip title="Edit Profile Picture">
              <IconButton
                onClick={editProfilePicture}
                className={classes.uploadBtn}
              >
                <Edit color="primary"></Edit>
              </IconButton>
            </Tooltip>
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
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} className={classes.logoutBtn}>
              <ExitToApp color="primary"></ExitToApp>
            </IconButton>
          </Tooltip>
          <EditProfile></EditProfile>
        </Card>
      </div>
    )
  ) : (
    <div>
      <h3>No Profile found. Please Login</h3>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/login"
        className={classes.button}
      >
        Login
      </Button>
      <Button variant="contained" color="primary" component={Link} to="/signup">
        Signup
      </Button>
    </div>
  );

  return profileMarkup;
}

export default Profile;
