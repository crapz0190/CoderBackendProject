import { productRepository } from "../services/repository/products.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class ProductController {
  // Metodo GET para mostrar productos por paginado
  allProducts = async (req, res) => {
    try {
      const allProducts = await productRepository.paginate(req.query);
      if (allProducts.length === 0) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

        // return res
        //   .status(404)
        //   .json({ status: "error", message: "Products not found" });
      } else {
        return res.status(200).json({ payload: allProducts });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para encontrar productos por ID
  productById = async (req, res) => {
    const { pid } = req.params;
    try {
      const productById = await productRepository.findById(pid);
      if (!productById) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

        // return res
        //   .status(404)
        //   .json({ status: "error", message: "Product not found" });
      } else {
        return res
          .status(200)
          .json({ status: "success", payload: productById });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo POST para crear productos
  addProduct = async (req, res) => {
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
      console.error("error al crear el producto", e);

      // CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo PUT para actualizar productos por ID
  updateProductById = async (req, res) => {
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

        const products = await productRepository.findAll();
        const verifyCode = products.findIndex((item) => item.code === obj.code);

        // agregar validacion del mismo code para que lo acepte

        if (verifyCode === -1) {
          const updateProduct = await productRepository.updateOne(pid, obj);
          return res.status(200).json({ status: "success", updateProduct });
        } else {
          return res
            .status(404)
            .json({ status: "error", message: "Repeated code" });
        }
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo DELETE para eliminar un producto por ID
  removeProductById = async (req, res) => {
    const { pid } = req.params;
    try {
      const foundProduct = await productRepository.findById(pid);
      console.log(foundProduct);

      if (!foundProduct) {
        // CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      } else {
        const userRole = req.user.role;
        if (
          userRole === "admin" ||
          (userRole === "premium" && foundProduct.owner === "premium")
        ) {
          console.log("Producto eliminado");

          // const removeProduct = await productRepository.deleteOne(pid);
          // return res.status(200).json({ status: "success", removeProduct });
        } else {
          return res.status(403).json({
            status: "error",
            message: "You don't have permission to delete this product",
          });
        }
      }
    } catch (e) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  };
}

export const productController = new ProductController();
