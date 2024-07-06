import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../app";

// tell to TS that we have a global property called signup
declare global {
  namespace NodeJS {
    export interface Global {
      // assing signup() to global scope so can be easily used only in the test files
      // second option was to create a separate file and import this function in every test
      // this will return a Promise that will resolve itself with a cookie,
      // cookie that is, in TS, type array of strings
      signup(): Promise<string[]>;
    }
  }
}

let mongo: any;

// So to create an instance of MongoMemoryServer, before all of our tests set up, we're going to define a hook function.
beforeAll(async () => {
  process.env.JWT_KEY = "dsadfgfdgfdgdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = new MongoMemoryServer();
  // console.log("=========================================================>", mongo);
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// before each test starts we're going to reach into this MongoDB database and we're going to delete all the data inside there.
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // delete all those different collections.
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// After all of our tests are complete., we need to stop that MongoMemoryServer.
afterAll(async () => {
  // console.log("=========================================================>", mongo);
  await mongo.stop();
  // also going to tell Mongoose to disconnect from it as well.
  await mongoose.connection.close();
});

global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
