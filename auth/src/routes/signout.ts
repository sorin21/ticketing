import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

/* 
  The reason we are renaming that export with this router as current user router is that we're going to
  end up with many different routers inside of our application.
  And so they can't all be called router. They have to be called something different.
*/
export { router as signoutRouter };
