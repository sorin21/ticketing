import mongoose from "mongoose";

import { app } from "./app";

const connectMongoDB = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined ");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined ");
  }

  // if we fail to connect to mongo, we need to cach the error, that is why we use trycatch
  try {
    // this comes from auth-mongo-depl, where we have kind: Service
    // 27017/Db-Name Db-Name will be created automatically
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected!");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening Auth on port 3000!");
  });
};

connectMongoDB();
