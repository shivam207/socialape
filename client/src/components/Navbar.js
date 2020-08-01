import Appbar from "@material-ui/core/Appbar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import PostScream from "./PostScream";
import Notifications from "./Notifications";
// Material Icons
import HomeIcon from "@material-ui/icons/Home";

class Navbar extends Component {
  render() {
    return (
      <Appbar position="fixed">
        <Toolbar className="nav-container">
          {this.props.authenticated ? (
            <Fragment>
              <PostScream></PostScream>
              <Link to="/">
                <MyButton tip={"Home"}>
                  <HomeIcon></HomeIcon>
                </MyButton>
              </Link>
              <Notifications></Notifications>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </Appbar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);
