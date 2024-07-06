import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// set this Publisher as a generic class
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  /* 
    Our Publisher is going to need a copy of the Nats client that 
    has already been initialized inside of our application.

    So we'll make sure this thing has a constructor,
    where we're going to receive some client type Stan.
  */
  constructor(client: Stan) {
    // we'll make sure that we update the client property.
    this.client = client;
  }

  // the goal of this function is going to be to take some data or like an event data
  // and publish it off to the NATS streaming server.
  // This thing is going to take some data that we want to publish and its type is going to be of type T
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
  }
}
