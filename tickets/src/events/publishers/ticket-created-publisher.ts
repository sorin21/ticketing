import { Publisher, Subjects, TicketCreatedEvent } from "@sorin21us/-dscommon";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
