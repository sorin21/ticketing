import mongoose from "mongoose";

import { Password } from "../services/password-hash";

// Interface that describes the properties
// that are required to create a new record, new User
interface UserAttrs {
  email: string;
  password: string;
}

/* 
  Interface that describes what the entire collection of ussers looks like, 
  or at least methods associated with the User model
*/
// Interface that describes the properties
// that  User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  // this is going to tell TypeScript about the existence of the build method
  //  and what properties it accepts.
  // It's going to take an argument called attrs.It must be of type UserAttrs
  // This : UserDoc indicates that when we call build we return an instance of a user, a user document
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the properties
// that a single User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // we don't tell to mongoose to add these props for us
  // createdAt: string;
  // updateddAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // doc is user document
      // So RET is going to be just the properties that are tied to our user document that we what to keep
      // ret returned object, is what will be transformed into a json. So Mongoose
      // is going to try to turn this thing into JSON for us.
      transform(doc, ret) {
        ret.id = ret._id;
        // This delete is normal JavaScript right here, not TS or Mongoose
        delete ret._id;
        // remove the password
        // delete comes from js and  will remove a prop from and object
        delete ret.password;
        // __v is version key
        delete ret.__v;
      },
    },
  }
);

// This pre is a middleware function implemented in mongoose
// Any time we attempt to save a document to our database, we are going to execute this callback function
// we have to call done, that means done after we finish all the work inside this fc
// so whenever we put together a middleware function, we use regular function and not arrow function, because we get acces
// to document that is saved, so the actual user that we're trying to persist to the database as "this" inside of this function.
// meaning the actual user document as "this" only inside of regular function
// If will use an arrow function, the value of this, inside the function, will be overwritten
// will be actually equal with the context of the entire file(user.ts file), instead of the User document
userSchema.pre("save", async function (done) {
  // console.log("thisss", this);
  // Check if the user modified the password
  // if the user updates the email or password, we have to hash again the updated one
  // the problem will be that even we create user first time
  // User.build({email: "dsadasda", password: "tregrsdf"})
  // mongoose will consider that the password was changed, so isModified() will return true
  if (this.isModified("password")) {
    // get the hashed version of password, toHash, and pass the user's password that we set on User document
    const hashed = await Password.toHash(this.get("password"));
    // update the updated or new password, with the hashed version of it
    this.set("password", hashed);
  }
  // call done because we done all the all async work
  done();
});

// const buildUser = (attrs: UserAttrs) => new User(attrs);
// So this is how we get a custom function built into a model. We add it to this static property on our schema.
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

// we set the model to be a generic type UserDoc
// and  mongoose.model() to return a UserModel generic type
// if we hover const User we see, that User is type UserModel
// const User: UserModel
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
