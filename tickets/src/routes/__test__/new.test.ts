import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

jest.mock("../../nats-wrapper.ts");

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("returns a status 401 if the user is not signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status 200 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    // we add this global.signin() inside test/setup.ts
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  // 1. if we send an empty title
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    // we shoudl mark this reques as invalid
    .expect(400);
  // 2. or we don't send the title
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    // we shoudl mark this reques as invalid
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asldkjf",
      // we don't want a user to enter negative values
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "laskdfj",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "asldkfj";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  // console.log("requ", requ.body);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
