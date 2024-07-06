import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

// to clear all the TS starting output
console.clear();

// wait for stan or the client in this case to successfully connect to our NATS Streaming Server.
// "abc" is the client ID
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// So we're going to listen for the connect event.
// So this arrow function will be executed after the client has successfully connected to the NATS Streaming Server.
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // publish an event and pass the NATS client
  const publisher = new TicketCreatedPublisher(stan);
  try {
    // publish this ticket
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: "$20",
  });

  // TicketCreated is the subject
  // data is data we want to share it
  /* 
    So you will see a lot of stuff in the Nats documentation referring to this data or this information
    we're sending out as a message, whereas in this course we're referring to it as an event because that's
    really what it is to us.
  */
  stan.publish("TicketCreated", data, () => {
    console.log("Event published");
  });
});
