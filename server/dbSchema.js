let db = {
  screams: [
    {
      handle: "user",
      body: "Have patience, It takes time to build stuff.",
      createdAt: "2020-07-18T20:11:44.620Z",
      likesCount: 5,
      commentCount: 10,
    },
  ],
  users: [
    {
      handle: "user",
      userId: "pSr9wtwuBeRw4cyJXBrj8sOYrWu1",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/socialape-aa773.appspot.com/o/89631099200.jpg?alt=media",
      email: "user@email.com",
      createdAt: "2020-07-19T13:13:48.326Z",
      bio: "Software Developer",
      website: "https://shivam207.github.io",
      location: "Meerut, India",
    },
  ],
  comments: [
    {
      handle: "user",
      screamId: "pSr9wtwuBeRw4cyJXBrj8sOYrWu1",
      body: "Hey, I am comment",
      createdAt: "2020-07-19T13:13:48.326Z",
    },
  ],
  notifications: [
    {
      recepient: "shivam207",
      sender: "user",
      createdAt: "2020-07-19T13:13:48.326Z",
      type: "like | comment",
      read: "true | false",
      screamId: "2e89denj38nd20dn",
    },
  ],
};

const userDetails = {
  // Redux Data
  credentials: {
    handle: "user",
    userId: "pSr9wtwuBeRw4cyJXBrj8sOYrWu1",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/socialape-aa773.appspot.com/o/89631099200.jpg?alt=media",
    email: "user@email.com",
    createdAt: "2020-07-19T13:13:48.326Z",
    bio: "Software Developer",
    website: "https://shivam207.github.io",
    location: "Meerut, India",
  },
  likes: [
    {
      userHandle: "user",
      screamId: "pSr9wtwuBeRw4cyJXBrj8sOYrWu1",
    },
    {
      userHandle: "user",
      screamId: "pSr9wtwuBeRw4cyJXBrj8sOYrWu1",
    },
  ],
};
