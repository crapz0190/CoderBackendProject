import { ticketsDAO } from "../dao/tickets.dao.js";

class TicketService {
  createTicket = async (obj) => {
    const tickets = await ticketsDAO.createOne(obj);
    return tickets;
  };
}
export const ticketService = new TicketService();
