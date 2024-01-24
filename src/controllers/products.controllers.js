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
      CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

      // return res
      //   .status(400)
      //   .json({ status: "error", message: "Invalid product data" });
    }

    // Guarda los nombres de los archivos en el array de imágenes del producto
    obj.thumbnails = files;

    try {
      const createdProduct = await productRepository.createOne(obj);
      return res
        .status(200)
        .json({ status: "success", payload: createdProduct });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo PUT para actualizar productos por ID
  updateProductById = async (req, res) => {
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
      CustomError.generateError(ErrorsMessages.BAD_REQUEST, 400);

      // return res
      //   .status(400)
      //   .json({ status: "error", message: "Invalid product data" });
    }

    // Guarda los nombres de los archivos en el array de imágenes del producto
    obj.thumbnails = files;

    try {
      const foundId = await productRepository.findById(pid);
      if (!foundId) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

        // return res
        //   .status(404)
        //   .json({ status: "error", message: "Product not found" });
      } else {
        const updateProduct = await productRepository.updateOne(pid, obj);
        return res.status(200).json({ status: "success", updateProduct });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo DELETE para eliminar un producto por ID
  removeProductById = async (req, res) => {
    const { pid } = req.params;

    const foundId = await productRepository.findById(pid);
    if (!foundId) {
      CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);

      // return res
      //   .status(404)
      //   .json({ status: "error", message: "Product not found" });
    }

    try {
      const removeProduct = await productRepository.deleteOne(pid);
      return res.status(200).json({ status: "success", removeProduct });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };
}

export const productController = new ProductController();
