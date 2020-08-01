import React, { Component } from "react";
import monkey from "../images/icon.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// MUI Stuff
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux Stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userAction";

const styles = {
  image: {
    padding: 20,
  },
  loginForm: {
    textAlign: "center",
  },
  textField: {
    margin: "20px auto 0px auto",
  },
  button: {
    marginTop: 20,
  },
  generalError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
};

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLogin = (event) => {
    let userData = {
      email: this.state.email,
      password: this.state.password,
    };

    // Call User Action
    this.props.loginUser(userData, this.props.history);
  };
  render() {
    const {
      classes,
      UI: { loading, errors },
    } = this.props;
    return (
      <div className="container">
        <Grid container>
          <Grid item sm></Grid>
          <Grid item sm className={classes.loginForm}>
            <img src={monkey} alt="monkey icon" className={classes.image}></img>
            <Typography variant="h4">Login</Typography>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              fullWidth
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              helperText={errors.email}
              error={errors.email ? true : false}
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              fullWidth
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              helperText={errors.password}
              error={errors.password ? true : false}
            />
            {errors.general && (
              <Typography variant="body2" className={classes.generalError}>
                {errors.general}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleLogin}
              disabled={loading}
            >
              Login
              {loading ? <CircularProgress color="secondary" size={20} /> : ""}
            </Button>
            <p>
              Don't have an account ? <Link to="/signup">Signup</Link>
            </p>
          </Grid>
          <Grid item sm></Grid>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionstoProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionstoProps
)(withStyles(styles)(Login));
