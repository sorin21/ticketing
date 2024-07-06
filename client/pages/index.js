import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("currentUser", currentUser);

  return currentUser ? <h1>You are signed in</h1> : <h1>You need to sign in</h1>;
};
// So rather than trying to destruct req, we're just going to receive this entire first argument.
// LandingPage.getInitialProps = async ({ req }) => {
// The first argument to this function we usually refer to as context.
LandingPage.getInitialProps = async (context) => {
  console.log("Landing Page");
  // buildClient() will give us the axios instance
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
