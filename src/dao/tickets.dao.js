import { ticketsModel } from "../models/ticket.model.js";
import BasicDAO from "./basic.dao.js";

class TicketDAO extends BasicDAO {
  constructor() {
    super(ticketsModel);
  }

  async findByEmail(email) {
    try {
      const response = await usersModel.findOne({ email });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const ticketsDAO = new TicketDAO();
