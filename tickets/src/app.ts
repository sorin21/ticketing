import express from "express";
// import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@sorin21us/-dscommon";

import "express-async-errors";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
// middlewares
app.use(express.json());
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
// cookie has to run 1st to have time for req.session to pe set
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
