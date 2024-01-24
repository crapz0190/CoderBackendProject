import { messageRepository } from "../services/repository/messages.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class MessageController {
  // Metodo GET para mostrar todos los mensajes
  listMessages = async (req, res) => {
    try {
      const messages = await messageRepository.findAll();
      if (!messages) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

        // return res
        //   .status(404)
        //   .json({ status: "error", message: "Messages not found" });
      } else {
        return res
          .status(200)
          .json({ status: "Message list", payload: messages });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para mostrar todos los mensajes
  messageById = async (req, res) => {
    const { mid } = req.params;
    try {
      const messages = await messageRepository.findById(mid);
      if (!messages) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

        // return res
        //   .status(404)
        //   .json({ status: "error", message: "Messages not found" });
      } else {
        return res
          .status(200)
          .json({ status: "Message found", payload: messages });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo POST para crear mensages
  createMessages = async (req, res) => {
    const obj = req.body;
    const { email, description } = obj;

    if (!email || !description) {
      CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

      // return res
      //   .status(400)
      //   .json({ status: "error", message: "All field are required" });
    }

    try {
      const messageCreated = await messageRepository.createOne(obj);
      return res
        .status(200)
        .json({ status: "Created", payload: messageCreated });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo PUT para actualizar mensages
  updateMessages = async (req, res) => {
    const { mid } = req.params;
    const obj = req.body;
    const { email, description } = obj;

    if (!email || !description) {
      CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

      // return res
      //   .status(400)
      //   .json({ status: "error", message: "All field are required" });
    }

    try {
      const messageUpdated = await messageRepository.updateOne(mid, obj);
      return res
        .status(200)
        .json({ status: "Updated", payload: messageUpdated });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo DELETE para eliminar mensages
  deleteMessages = async (req, res) => {
    const { mid } = req.params;

    try {
      const messageRemoved = await messageRepository.deleteOne(mid);
      return res
        .status(200)
        .json({ status: "Deleted", payload: messageRemoved });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };
}

export const messageController = new MessageController();
