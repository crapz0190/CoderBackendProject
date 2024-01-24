import { messagesDAO } from "../dao/messages.dao.js";

class MessageService {
  findAll = async () => {
    const messages = await messagesDAO.findAll();
    return messages;
  };

  findById = async (mid) => {
    const messages = await messagesDAO.getById(mid);
    return messages;
  };

  createOne = async (obj) => {
    const messages = await messagesDAO.createOne(obj);
    return messages;
  };

  updateOne = async (mid, obj) => {
    const messages = await messagesDAO.updateOne(mid, obj);
    return messages;
  };

  deleteOne = async (mid) => {
    const messages = await messagesDAO.deleteOne(mid);
    return messages;
  };
}
export const messageService = new MessageService();
