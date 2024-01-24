import { Router } from "express";
import { upload } from "../utils/multer.js";
import { productController } from "../controllers/products.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ruta GET para mostrar productos por paginado
router.get(
  "/",
  authMiddleware(["user", "admin"]),
  productController.allProducts
);

// ruta GET para encontrar productos por ID
router.get(
  "/:pid",
  authMiddleware(["user", "admin"]),
  productController.productById
);

// ruta POST para crear productos
router.post(
  "/add",
  authMiddleware(["admin"]),
  upload.array("thumbnails", 5),
  productController.addProduct
);

// ruta PUT para actualizar productos por ID
router.put(
  "/:pid",
  authMiddleware(["admin"]),
  upload.array("thumbnails", 5),
  productController.updateProductById
);

// ruta DELETE para eliminar un producto por ID
router.delete(
  "/:pid",
  authMiddleware(["admin"]),
  productController.removeProductById
);

export default router;
