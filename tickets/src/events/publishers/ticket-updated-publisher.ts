import { Publisher, Subjects, TicketUpdatedEvent } from "@sorin21us/-dscommon";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
