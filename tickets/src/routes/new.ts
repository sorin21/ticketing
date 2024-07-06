import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, ValidateRequest } from "@sorin21us/-dscommon";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  ValidateRequest,
  async (req, res) => {
    // The title right here is the same as the title on the above ticket.
    // So the value that came in off the request body is not necessarily the same as what actually
    // got saved to the database.
    // So I really recommend pulling the title or all these relevant attributes directly off of the ticket
    // that we just saved to the database, as opposed to pulling the title and price off the request body
    // Because again, they might actually be different values.
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    // synchronous fashion
    await ticket.save();

    // When we call this, we need to pass in the active NATS client
    // So that's how we make use of a getter in TypeScript.
    // asynchronous fashion
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
