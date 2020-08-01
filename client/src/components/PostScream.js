import React, { Fragment, useState, useEffect } from "react";
import MyButton from "../util/MyButton";
// MUI stuff
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { postScream, clearErrors } from "../redux/actions/dataAction";

const useStyles = makeStyles((theme) => ({
  closeBtn: {
    position: "absolute",
    right: "2%",
    top: "3%",
  },
  submitBtn: {
    marginTop: "10px",
  },
}));

function PostScream() {
  const [open, setOpen] = useState(false);
  const [scream, setScream] = useState("");

  const dispatch = useDispatch();

  const { errors, loading } = useSelector((state) => state.UI);

  const classes = useStyles();

  useEffect(() => {
    console.log("Post Scream Use Effect");
    // It should trigger on any change in loading and errors in UI store
    console.log(errors, loading);
    if (!loading && !errors.scream && open) {
      handleClose();
    }
  }, [errors, loading]);

  const handleClose = () => {
    setScream("");
    setOpen(false);
    dispatch(clearErrors());
    console.log("Handle Close");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postScream(scream));
  };

  const handleChange = (event) => {
    setScream(event.target.value);
  };

  return (
    <Fragment>
      <MyButton tip={"Post a Scream"} onClick={handleOpen}>
        <AddIcon></AddIcon>
      </MyButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Post a Scream</DialogTitle>
        <MyButton
          tip="close"
          onClick={handleClose}
          btnClassName={classes.closeBtn}
        >
          <Close></Close>
        </MyButton>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              name="scream"
              label="Scream"
              placeholder="Create a scream for fellow Apes"
              multiline
              rows={3}
              fullWidth
              onChange={handleChange}
              value={scream}
              error={errors.scream ? true : false}
              helperText={errors.scream}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.submitBtn}
              disabled={loading ? true : false}
            >
              Submit
              {loading ? (
                <CircularProgress
                  color="secondary"
                  size={20}
                ></CircularProgress>
              ) : null}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default PostScream;
