import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  // the actual event ticket:created
  subject: Subjects.TicketCreated;
  // data that we expect to see in that event
  data: {
    id: string;
    title: string;
    price: number;
  };
}
