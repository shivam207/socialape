import React, { useState, Fragment } from "react";
import dayjs from "dayjs";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationIcon from "@material-ui/icons/Notifications";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime";

import Favorite from "@material-ui/icons/Favorite";
import Comment from "@material-ui/icons/Comment";

import { markNotificationRead } from "../redux/actions/userAction";

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);

  //   Get notification from store
  const notifications = useSelector((state) => state.user.notifications);
  const dispatch = useDispatch();

  dayjs.extend(relativeTime);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    console.log(e.target);
    if (notifications && notifications.length > 0) {
      let notificationIds = notifications
        .filter((n) => n.read === false)
        .map((n) => n.notificationId);
      dispatch(markNotificationRead(notificationIds));
    }

    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Tooltip title="Notifications">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <Badge
            badgeContent={notifications.filter((n) => n.read === false).length}
          >
            <NotificationIcon></NotificationIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.map((n) => {
          let type = n.type === "like" ? "liked" : "commented on";
          let icon = n.read ? (
            n.type === "like" ? (
              <Favorite color="primary"></Favorite>
            ) : (
              <Comment color="primary"></Comment>
            )
          ) : n.type === "like" ? (
            <Favorite color="secondary"></Favorite>
          ) : (
            <Comment color="secondary"></Comment>
          );
          return (
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={`/user/${n.recepient}/scream/${n.screamId}`}
            >
              {icon}
              {`${n.sender} ${type} your scream ${dayjs(
                n.createdAt
              ).fromNow()}`}
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
}

export default Notifications;
