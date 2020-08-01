const validEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(re)) {
    return true;
  } else return false;
};

const isEmpty = (string) => {
  if (string.trim() == "") {
    return true;
  } else return false;
};

const validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!validEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";

  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const reduceUserDetails = (data) => {
  var userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio.trim();
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http")
      userDetails.website = `http://${data.website.trim()}`;
    else userDetails.website = data.website.trim();
  }
  if (!isEmpty(data.location.trim()))
    userDetails.location = data.location.trim();

  return userDetails;
};

module.exports = { validateSignupData, validateLoginData, reduceUserDetails };
