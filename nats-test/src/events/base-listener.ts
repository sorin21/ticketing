// Message is an interface that will describe the type of msg argument
import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

// This interface is going to describe a very generic kind of event
interface Event {
  // So for an object to be considered to be an event, it must have a subject property
  subject: Subjects;
  data: any;
}

// set this Listener as a generic class
/* 
  This means that whenever we try to make use of a Listener in any way, whenever we try to extend it, 
  we're going to have to provide some custom type to this: T extends Event
*/
export abstract class Listener<T extends Event> {
  // subject is going to be a string that's going to be the name of the channel that we're going to listen to.
  // the subject that is provided must be exactly equal to whatever subject was provided on this argument.
  // So we'll say T at subject.
  abstract subject: T["subject"];
  // Name of the queue group that this listener will join
  abstract queueGroupName: string;
  // Function to run when the message is received
  // data is going to be of type T at data
  /* 
    data is this obj from ticket-created-event.ts file
    data: {
      id: string;
      title: string;
      price: number;
    };
  */
  abstract onMessage(data: T["data"], msg: Message): void;
  // pre-initialized NATS client
  private client: Stan;
  // Number of seconds that this listener has to ack a message
  // It turns out that when we create the subscription, we can also customize that 30 seconds.
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    // the client is our NATS library
    this.client = client;
  }

  // default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // this method has the code to setup the subscription
  listen() {
    const subscription = this.client.subscribe(
      // subject that we want to listen
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    // we lsitern for the above subscription
    // the message is the event that we listen for
    subscription.on("message", (msg: Message) => {
      msg.getSequence();
      console.log(
        `Message received: #${msg.getSequence()} - ${this.subject} / ${
          this.queueGroupName
        }`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  // helper method to parse a message
  parseMessage(msg: Message) {
    const data = msg.getData();
    // if is a string return it as it is
    // if is a buffer return it using toString()
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
