import { Router } from "express";
import { messageController } from "../controllers/messages.controllers.js";

const router = Router();

// ruta GET para mostrar todos los mensages
router.get("/", messageController.listMessages);

// ruta GET para mostrar mensage por ID
router.get("/:mid", messageController.messageById);

// ruta POST para crear mensages
router.post("/add", messageController.createMessages);

// ruta PUT para actualizar mensages
router.put("/:mid", messageController.updateMessages);

// ruta DELETE para eliminar mensages
router.delete("/:mid", messageController.deleteMessages);

export default router;
