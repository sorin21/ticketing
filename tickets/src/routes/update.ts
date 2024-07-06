import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  ValidateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@sorin21us/-dscommon";
import { Ticket } from "../models/ticket";

import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  ValidateRequest,
  async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // To apply the update, we can use the set command on the ticket document that we already fetched.
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    // synchronous fashion
    await ticket.save();

    // right after we successfully do the save we want to make sure that we emit an update event
    // asynchronous fashion
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
