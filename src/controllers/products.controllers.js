import { productRepository } from "../services/repository/products.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class ProductController {
  // Metodo GET para mostrar productos por paginado
  allProducts = async (req, res, next) => {
    try {
      const allProducts = await productRepository.paginate(req.query);
      if (allProducts.length === 0) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
      } else {
        return res.status(200).json({ payload: allProducts });
      }
    } catch (e) {
      next(e);
    }
  };

  // Metodo GET para encontrar productos por ID
  productById = async (req, res, next) => {
    const { pid } = req.params;
    try {
      const productById = await productRepository.findById(pid);
      if (!productById) {
        CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
      } else {
        return res
          .status(200)
          .json({ status: "success", payload: productById });
      }
    } catch (e) {
      next(e);
    }
  };

  // Metodo POST para crear productos
  addProduct = async (req, res, next) => {
    try {
      const obj = req.body;
      const files = req.files.map((file) => file.filename);
      const user = req.user;

      // // Validación de campos del producto

      function validateProductFields(obj) {
        if (
          obj.title &&
          obj.description &&
          obj.code &&
          obj.price &&
          obj.stock &&
          obj.category
        ) {
          return true;
        }
        return false;
      }

      if (!validateProductFields(obj)) {
        // CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

        return res
          .status(400)
          .json({ status: "error", message: "Invalid product data" });
      } else {
        // // Guarda los nombres de los archivos en el array de imágenes del producto
        obj.thumbnails = files;

        // Agrega el ID de usuario y el rol al campo owner
        const userId = user._id;
        const role = user.role;
        obj.owner = [{ idUser: userId, role }];

        const products = await productRepository.findAll();
        const verifyCode = products.findIndex((item) => item.code === obj.code);

        if (verifyCode === -1) {
          const createdProduct = await productRepository.createOne(obj);
          return res
            .status(200)
            .json({ status: "success", payload: createdProduct });
        } else {
          return res
            .status(404)
            .json({ status: "error", message: "Repeated code" });
        }
      }
    } catch (e) {
      next(e);
    }
  };

  // Metodo PUT para actualizar productos por ID
  updateProductById = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const obj = req.body;
      const files = req.files.map((file) => file.filename);

      // Validación de campos del producto

      function validateProductFields(obj) {
        if (
          obj.title &&
          obj.description &&
          obj.code &&
          obj.price &&
          obj.stock &&
          obj.category
        ) {
          return true;
        }
        return false;
      }

      if (!validateProductFields(obj)) {
        // CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

        return res
          .status(400)
          .json({ status: "error", message: "Invalid product data" });
      } else {
        // Guarda los nombres de los archivos en el array de imágenes del producto
        obj.thumbnails = files;

        const foundId = await productRepository.findById(pid);
        if (!foundId) {
          // CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

          return res
            .status(404)
            .json({ status: "error", message: "Product not found" });
        }

        const updateProduct = await productRepository.updateOne(pid, obj);
        return res.status(200).json({ status: "success", updateProduct });
      }
      /** 
        const products = await productRepository.findAll();
        const verifyCode = products.findIndex((item) => item.code === obj.code)

        if (verifyCode === -1) {}

      */
    } catch (e) {
      next(e);
    }
  };

  // Metodo DELETE para eliminar un producto por ID
  removeProductById = async (req, res, next) => {
    const { pid } = req.params;
    try {
      const foundProduct = await productRepository.findById(pid);
      const roleOwner = foundProduct.owner.find((item) => item.idUser);

      if (!foundProduct._id) {
        // CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      } else {
        const userRole = req.user.role;
        if (
          userRole === "admin" ||
          (userRole === "premium" && roleOwner.role === "premium")
        ) {
          const removeProduct = await productRepository.deleteOne(pid);
          return res.status(200).json({ status: "success", removeProduct });
        } else if (userRole === "premium" && roleOwner.role === "admin") {
          return res.status(403).json({
            status: "error",
            message: "You don't have permission to delete this product",
          });
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export const productController = new ProductController();
