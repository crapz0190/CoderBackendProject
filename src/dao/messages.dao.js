import { messagesModel } from "../models/messages.model.js";
import BasicDAO from "./basic.dao.js";

class MessagesDAO extends BasicDAO {
  constructor() {
    super(messagesModel);
  }

  async findAll() {
    try {
      const response = await messagesModel.find().lean();
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const messagesDAO = new MessagesDAO();
