import React, { useState, Fragment } from "react";
import MyButton from "../util/MyButton";

import DeleteOutline from "@material-ui/icons/DeleteOutline";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

// Redux
import { useDispatch } from "react-redux";
import { deleteScream } from "../redux/actions/dataAction";

const useStyles = makeStyles((theme) => ({
  deleteBtn: {
    position: "absolute",
    left: "90%",
    top: "5%",
  },
}));

function DeleteButton({ screamId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete confirmed");
    dispatch(deleteScream(screamId));
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <Fragment>
      <MyButton
        tip="Delete Scream"
        onClick={handleOpen}
        btnClassName={classes.deleteBtn}
      >
        <DeleteOutline color="secondary"></DeleteOutline>
      </MyButton>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure you want to delete this scream?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default DeleteButton;
