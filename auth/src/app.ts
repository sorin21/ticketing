import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@sorin21us/-dscommon";

import "express-async-errors";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { sigupRouter } from "./routes/signup";

const app = express();

app.set("trust proxy", true);
// middlewares
app.use(json());
app.use(
  cookieSession({
    // disable encryption on the cookie
    signed: false,
    // this cookie will be used only
    // if the user visits our app on https connection

    // Because we add this secure: true setting we have to add above app.set("trust proxy", true);

    // I'm also going to require that cookies will only be used if a user is visiting our
    // application over an HTTPS connection.
    // This is a very small security improvement
    // secure: true,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(sigupRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
