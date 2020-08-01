import React, { useEffect, useState } from "react";
import Scream from "../components/Scream";
import axios from "axios";
import StaticProfile from "../components/StaticProfile";

import Grid from "@material-ui/core/Grid";

function User(props) {
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  let handle = props.match.params.handle;
  let screamId = props.match.params.screamId;
  console.log("USer component");
  console.log(screamId);
  let recentScreamsMarkup = errors.message ? (
    <p>User Not found</p>
  ) : profile ? (
    profile.screams.map((scream) => {
      if (scream.screamId === screamId) {
        console.log("this scream open");
        return (
          <Scream key={scream.screamId} scream={scream} openDialog></Scream>
        );
      } else {
        return <Scream key={scream.screamId} scream={scream}></Scream>;
      }
    })
  ) : (
    <h2>Loading....</h2>
  );

  useEffect(() => {
    // handle = props.match.params.handle;
    // screamId = props.match.params.screamId;
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        setProfile(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrors(err.response.data);
      });
  }, [handle]);

  return (
    <div className="container">
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {profile && <StaticProfile user={profile.user}></StaticProfile>}
        </Grid>
      </Grid>{" "}
    </div>
  );
}

export default User;
