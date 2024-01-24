import { ticketService } from "../tickets.service.js";

class TicketRepository {
  constructor(ticketService) {
    this.ticketRepository = ticketService;
  }

  createTicket = (obj) => {
    return this.ticketRepository.createTicket(obj);
  };
}

export const ticketRepository = new TicketRepository(ticketService);
