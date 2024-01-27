import { messageRepository } from "../services/repository/messages.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class MessageController {
  // Metodo GET para mostrar todos los mensajes
  listMessages = async (req, res, next) => {
    try {
      const messages = await messageRepository.findAll();
      if (!messages) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
      } else {
        return res
          .status(200)
          .json({ status: "Message list", payload: messages });
      }
    } catch (e) {
      next(e);
    }
  };

  // Metodo GET para mostrar todos los mensajes
  messageById = async (req, res, next) => {
    const { mid } = req.params;
    try {
      const messages = await messageRepository.findById(mid);
      if (!messages) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
      } else {
        return res
          .status(200)
          .json({ status: "Message found", payload: messages });
      }
    } catch (e) {
      next(e);
    }
  };

  // Metodo POST para crear mensages
  createMessages = async (req, res, next) => {
    const obj = req.body;
    const { email, description } = obj;

    try {
      if (!email || !description) {
        CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);
      }

      const messageCreated = await messageRepository.createOne(obj);
      return res
        .status(200)
        .json({ status: "Created", payload: messageCreated });
    } catch (e) {
      next(e);
    }
  };

  // Metodo PUT para actualizar mensages
  updateMessages = async (req, res, next) => {
    const { mid } = req.params;
    const obj = req.body;
    const { email, description } = obj;

    try {
      if (!email || !description) {
        CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);
      }

      const messageUpdated = await messageRepository.updateOne(mid, obj);
      return res
        .status(200)
        .json({ status: "Updated", payload: messageUpdated });
    } catch (e) {
      next(e);
    }
  };

  // Metodo DELETE para eliminar mensages
  deleteMessages = async (req, res, next) => {
    const { mid } = req.params;

    try {
      const messageRemoved = await messageRepository.deleteOne(mid);
      return res
        .status(200)
        .json({ status: "Deleted", payload: messageRemoved });
    } catch (e) {
      next(e);
    }
  };
}

export const messageController = new MessageController();
