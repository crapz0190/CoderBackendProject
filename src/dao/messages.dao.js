import { messagesModel } from "../models/messages.model.js";
import BasicDAO from "./basic.dao.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class MessagesDAO extends BasicDAO {
  constructor() {
    super(messagesModel);
  }

  async findAll() {
    try {
      const response = await messagesModel.find().lean();
      return response;
    } catch (error) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  }
}

export const messagesDAO = new MessagesDAO();
