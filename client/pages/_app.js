import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";

import Header from "../components/header";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
