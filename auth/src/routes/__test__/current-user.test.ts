import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // we are pulling off that authentication cookie
  // that is the thing that contains our JSON web token inside of it.
  // const cookie = authResponse.get("Set-Cookie");
  // update: cookie is on global scope declared inside setup.ts file
  const cookie = await global.signup();
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).send().expect(200);

  // console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  // 200 because The 'currentuser' describes whether or not the person making the request is authorized.
  // It doesn't result in a 401 if they aren't logged in - it shows a 200 regardless.
  const response = await request(app).get("/api/users/currentuser").send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
