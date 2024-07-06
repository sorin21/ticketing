import mongoose from "mongoose";

import { app } from "./app";
/* 
  Notice I'm importung using a lowercase for natsWrapper.
  The reason for that is that we are indicating that this is an instance of the class NatsWrapper, from nats-wrapper.ts file.
  We only have one instance floating around the entire application because we are not exporting the class.
  We are exporting one single instance that will be shared between all of our different files.
*/
import { natsWrapper } from "./nats-wrapper";

const connectMongoDB = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined ");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined ");
  }

  // if we fail to connect to mongo, we need to cach the error, that is why we use trycatch
  try {
    /* 
      this ticketing comes from k8s/nats-depls.yaml file, from cluster id:
      '-cid',
      'ticketing',
    */
    //  nats-srv:4222 comes from k8s/nats-depls.yaml, from name: nats-srv, port: 4222
    await natsWrapper.connect("ticketing", "dafsa", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    // So these are watching for interrupt signals or terminate signals.
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // this comes from auth-mongo-depl, where we have kind: Service
    // 27017/Db-Name Db-Name will be created automatically
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening Tickets on port 3000!");
  });
};

connectMongoDB();
