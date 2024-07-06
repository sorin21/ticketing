import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { ValidateRequest, BadRequestError } from "@sorin21us/-dscommon";

import { Password } from "../services/password-hash";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password"),
  ],
  ValidateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    // if no user with this email found, then existingUser will be null
    const existingUser = await User.findOne({ email });

    // if the user already exists, exit
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials!");
    }

    // if we CTRL + Click on compare we can see the arguments
    // passwordsMatch is a boolian, true or false
    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials!");
    }

    // Our user is now logged in, so we need to once again generate a JSON web token
    // and send it back inside of the cookie.
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
      // "dasdsa"
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

/* 
  The reason we are renaming that export with this router as current user router is that we're going to
  end up with many different routers inside of our application.
  And so they can't all be called router. They have to be called something different.
*/
export { router as signinRouter };
