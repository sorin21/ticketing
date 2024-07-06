import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

/* 
  So over here we're now getting an air from Listener.
  And the reason is that now Listener is a generic class.
  So we have to provide a argument for type T.
  So our argument in this case, we want to put it in a type to Listener right here that describes the
  event that we expect to receive inside this Listener.
  And then we will provide TicketCreatedEvent as the generic type to Listener.
*/
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // subject is the channel that we are publishing information to.
  // We want to make sure that it is always exactly equal to TicketCreated.
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // like above line commented or like this above one putting readonly from TS
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  // msg is the event itself
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    /* 
      So if everything goes correctly, where you are going to call msg.ack() and acknowledge the message.
      Otherwise, if something goes wrong, we are not going to ack the message and just allow the message
      to time out.
    */
    msg.ack();
  }
}
