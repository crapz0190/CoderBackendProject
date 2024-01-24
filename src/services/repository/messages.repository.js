import { messageService } from "../messages.service.js";

class MessageRepository {
  constructor(messageService) {
    this.messageRepository = messageService;
  }

  findAll = () => {
    return this.messageRepository.findAll();
  };

  findById = (mid) => {
    return this.messageRepository.findById(mid);
  };

  createOne = (obj) => {
    return this.messageRepository.createOne(obj);
  };

  updateOne = (mid, obj) => {
    return this.messageRepository.updateOne(mid, obj);
  };

  deleteOne = (mid) => {
    return this.messageRepository.deleteOne(mid);
  };
}

export const messageRepository = new MessageRepository(messageService);
