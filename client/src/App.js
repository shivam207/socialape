import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import User from "./pages/User";
import "./App.css";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
// Mui Imports
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { logoutUser, getUserData } from "./redux/actions/userAction";
import { SET_AUTHENTICATED } from "./redux/types";
import axios from "axios";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#42a5f5",
    },
    secondary: {
      main: "rgb(241 10 10 / 68%)",
    },
  },
});

axios.defaults.baseURL =
  "https://us-central1-socialape-aa773.cloudfunctions.net/api";

const token = localStorage.getItem("social-ape-token");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    // window.location.href = "/login";
  } else {
    store.dispatch({
      type: SET_AUTHENTICATED,
    });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar></Navbar>
            <Switch>
              <AuthRoute exact path="/login" component={Login}></AuthRoute>
              <AuthRoute exact path="/signup" component={Signup}></AuthRoute>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/user/:handle" component={User}></Route>
              <Route
                exact
                path="/user/:handle/scream/:screamId"
                component={User}
              ></Route>
            </Switch>
          </Router>
        </Provider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
