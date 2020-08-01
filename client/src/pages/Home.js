import React, { Component } from "react";
import Scream from "../components/Scream";
import Grid from "@material-ui/core/Grid";
import Profile from "../components/Profile";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataAction";

class Home extends Component {
  componentDidMount() {
    console.log("Mount- Home Component called");
    this.props.getScreams();
  }
  render() {
    const { screams, loading } = this.props.data;
    let recentScreamsMarkup = !loading ? (
      screams.map((scream) => {
        return <Scream key={scream.screamId} scream={scream}></Scream>;
      })
    ) : (
      <h2>Loading....</h2>
    );

    return (
      <div className="container">
        <Grid container spacing={4}>
          <Grid item sm={8} xs={12}>
            {recentScreamsMarkup}
          </Grid>
          <Grid item sm={4} xs={12}>
            <Profile></Profile>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  screams: PropTypes.array.isRequired,
  getScreams: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(Home);
