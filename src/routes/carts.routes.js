import { Router } from "express";
import { cartController } from "../controllers/carts.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ruta GET para mostrar todos los carritos
router.get("/", authMiddleware(["admin"]), cartController.allCarts);

// ruta GET para encontrar carritos por ID
router.get("/:cid", authMiddleware(["user"]), cartController.cartById);

// ruta POST para finalizar el proceso de compra
router.post(
  "/:cid/purchase",
  authMiddleware(["user"]),
  cartController.purchasingProcess,
);

// ruta POST para crear un carrito
router.post("/add", authMiddleware(["admin"]), cartController.createCart);

// ruta PUT para agregar productos a un carrito
router.put(
  "/:cid/product/:pid",
  authMiddleware(["user"]),
  cartController.updateCart,
);

// ruta DELETE para eliminar un carrito
router.delete("/:cid", authMiddleware(["admin"]), cartController.removeCart);

// ruta DELETE para eliminar un producto del carrito
router.delete(
  "/:cid/product/:pid",
  authMiddleware(["user"]),
  cartController.removeProductByCart,
);

export default router;
