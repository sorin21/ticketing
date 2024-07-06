import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

// to clear all the TS starting output
console.clear();

// wait for stan or the client in this case to successfully connect to our NATS Streaming Server.
// generate a random client ID to not use "abc", like before, to have a unique client ID
// for every instance of multiple listeners
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

// watch for a connect event
stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// So these are watching for interrupt signals or terminate signals.
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
