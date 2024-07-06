import express from "express";

import { currentUser } from "@sorin21us/-dscommon";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  // If the user is not logged in we send back null
  res.send({ currentUser: req.currentUser || null });
});

/* 
  The reason we are renaming that export with this router as current user router is that we're going to
  end up with many different routers inside of our application.
  And so they can't all be called router. They have to be called something different.
*/
export { router as currentUserRouter };
