import React, { useState, Fragment, useEffect } from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Edit from "@material-ui/icons/Edit";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../redux/actions/userAction";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  editBtn: {
    float: "right",
  },
}));

function EditProfile() {
  // State for Dialog
  const [open, setOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    bio: "",
    website: "",
    location: "",
  });

  //Get credentials from redux store. This will update credentials whenever there is a change in state
  const credentials = useSelector((state) => state.user.credentials);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    console.log("Use effect called");

    console.log(credentials);
    const currentProfileDetails = {};
    if (credentials.bio) currentProfileDetails.bio = credentials.bio;
    if (credentials.website)
      currentProfileDetails.website = credentials.website;
    if (credentials.location)
      currentProfileDetails.location = credentials.location;

    setProfileDetails(currentProfileDetails);
  }, [credentials]);

  const handleOpen = () => {
    console.log("Opened");
    setOpen(true);
  };

  const handleSave = () => {
    console.log("Saved");
    dispatch(editProfile(profileDetails));
  };

  const handleClose = () => {
    console.log("Closed");
    setOpen(false);
  };

  const handleChange = (event) => {
    setProfileDetails({
      ...profileDetails,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <Fragment>
      <Tooltip title="Edit profile details">
        <IconButton onClick={handleOpen} className={classes.editBtn}>
          <Edit color="primary"></Edit>
        </IconButton>
      </Tooltip>

      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile Details</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              autoFocus
              margin="dense"
              label="Bio"
              type="text"
              name="bio"
              fullWidth
              multiline
              rows={3}
              placeholder="Your brief description "
              onChange={handleChange}
              value={profileDetails.bio}
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              label="Website"
              name="website"
              type="text"
              fullWidth
              placeholder="Your personal/professional website"
              onChange={handleChange}
              value={profileDetails.website}
            />
          </div>

          <div>
            <TextField
              autoFocus
              margin="dense"
              label="Location"
              name="location"
              type="text"
              fullWidth
              placeholder="Where you live"
              onChange={handleChange}
              value={profileDetails.location}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default EditProfile;
