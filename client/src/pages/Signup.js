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

// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userAction";

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

class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    loading: false,
    errors: {},
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLogin = (event) => {
    let newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle,
    };

    this.props.signupUser(newUserData, this.props.history);
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
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              fullWidth
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
            />
            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              fullWidth
              className={classes.textField}
              value={this.state.handle}
              onChange={this.handleChange}
              helperText={errors.handle}
              error={errors.handle ? true : false}
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
              Signup
              {loading && <CircularProgress color="secondary" size={20} />}
            </Button>
            <p>
              Already have an account ? <Link to="/signup">Signin</Link>
            </p>
          </Grid>
          <Grid item sm></Grid>
        </Grid>
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  signupUser,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Signup));
