/* eslint-disable no-dupe-keys */
import { productRepository } from "../services/repository/products.repository.js";
import { messageRepository } from "../services/repository/messages.repository.js";
import { cartRepository } from "../services/repository/carts.repository.js";
import { userRepository } from "../services/repository/users.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";

class ViewsControllers {
  home = async (req, res) => {
    try {
      return res.render("layouts/main", {
        title: "Home | Handlebars",
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para visualizar mensages
  listMessages = async (req, res) => {
    const { cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const getMessages = await messageRepository.findAll();
      return res.render("messages", {
        title: "Messages | Handlebars",
        messages: getMessages,
        cart,
        roleAdmin,
        roleUser,
        rolePremium,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // ruta GET para enviar actualizacion de los mensages
  renderEditMessage = async (req, res) => {
    const { mid } = req.params;
    const { cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const messages = await messageRepository.findById(mid);
      const { _id, email, description } = messages;

      return res.render("updateMessages", {
        title: "Update Form | Handlebars",
        _id,
        email,
        description,
        cart,
        roleAdmin,
        roleUser,
        rolePremium,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para mostrar productos
  listProducts = async (req, res) => {
    if (!req.session.passport) {
      return res.redirect("/login");
    }

    const { first_name, email, cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const products = await productRepository.paginate(req.query);
      const {
        payload,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      } = products;

      payload.map((product) => {
        product.firstThumbnail = `/images/${product.thumbnails[0]}`;
        return product;
      });

      res.render("products", {
        title: "Products | Handlebars",
        payload,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
        first_name,
        email,
        cart,
        roleAdmin,
        roleUser,
        rolePremium,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para mostrar formulario de carga de productos
  productsLoading = (req, res) => {
    const { cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      return res.render("formProducts", {
        title: "Upload products | Handlebars",
        roleAdmin,
        roleUser,
        rolePremium,
        cart,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para mostrar detalles del producto seleccionado
  productDetail = async (req, res) => {
    const { pid } = req.params;
    const cartFound = await cartRepository.findById(req.user.cart);
    const idCart = cartFound._id;
    const { cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const product = await productRepository.findById(pid);
      const thumbnailsData = product.thumbnails.map(
        (thumbnail) => `/images/${thumbnail}`,
      );

      const { _id, title, description, price, stock, category } = product;

      return res.render("productDetail", {
        title: "Details Products | Handlebars",
        _id,
        idCart,
        title,
        description,
        price,
        stock,
        category,
        thumbnails: thumbnailsData,
        cart,
        roleAdmin,
        roleUser,
        rolePremium,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para actualizar productos
  updateProduct = async (req, res) => {
    const { cart, role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const products = await productRepository.paginate(req.query);
      const { payload } = products;

      payload.map((item) => {
        item.firstThumbnail = item.thumbnails[0];
        return item;
      });

      payload.map((item) => {
        item.IdProductUpdate = item._id;
        return item;
      });

      return res.render("updateProducts", {
        title: "Update products| Handlebars",
        payload,
        roleAdmin,
        roleUser,
        rolePremium,
        cart,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para visualizar login
  login = (req, res) => {
    if (req.session.passport) {
      return res.redirect("/products");
    }

    const isAuthenticated = req.user === undefined;

    try {
      return res.render("login", {
        title: "Login | Handlebars",
        isAuthenticated,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para visualizar signup
  signup = (req, res) => {
    if (req.session.passport) {
      return res.redirect("/products");
    }

    const isAuthenticated = req.user === undefined;

    try {
      return res.render("signup", {
        title: "Sign Up | Handlebars",
        isAuthenticated,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // ruta GET permite enviar correro para restaurar contraseña
  emailRestorePassword = (req, res) => {
    const isAuthenticated = req.user === undefined;

    try {
      return res.render("nodemailer", {
        title: "Password recovery email | Handlebars",
        isAuthenticated,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  resetPasswordToken = async (req, res) => {
    const { token } = req.params;
    const isAuthenticated = req.user === undefined;
    // res.render("restore", { token });
    try {
      const user = await userRepository.findToken({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return res.redirect("/expired-link");
      }

      return res.render("restore", {
        title: "Reset password | Handlebars",
        token,
        isAuthenticated,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  expiredLink = (req, res) => {
    const isAuthenticated = req.user === undefined;

    try {
      return res.render("expiredLink", {
        title: "Expired Link | Handlebars",
        isAuthenticated,
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo GET para mostrar error
  failureRedirect = (req, res) => {
    const isAuthenticated = req.user === undefined;

    const message = req.session.messages[0];
    res.render("error", {
      title: "Error | Handlebars",
      message: message,
      isAuthenticated,
    });
  };

  // Metodo GET para visualizar creacion exitosa del producto
  successfulCreation = (req, res) => {
    const { role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";
    res.render("successful", {
      roleAdmin,
      roleUser,
      rolePremium,
    });
  };

  // Metodo GET para visualizar carrito de productos
  cart = async (req, res, next) => {
    // console.log("USER---->", req.user);
    if (!req.session.passport) {
      return res.redirect("/login");
    }

    const { cid } = req.params;
    const { role } = req.user;

    const roleAdmin = role === "admin";
    const roleUser = role === "user";
    const rolePremium = role === "premium";

    try {
      const cartFound = await cartRepository.findById(cid);
      const cartID = cartFound._id;

      if (cartFound && cartFound.products) {
        const productsData = cartFound.products.map((product) => {
          const idCart = cartFound._id;
          // console.log("isCart", idCart);
          // const thumbnailsData = product.product.thumbnails.map((thumbnail) => {
          //   return {
          //     url: `/images/${thumbnail}`,
          //   };
          // });
          const thumbnailData =
            product.product.thumbnails.length > 0
              ? `/images/${product.product.thumbnails[0]}`
              : "/default-image.jpg";

          return {
            idCart: idCart,
            id: product.product._id,
            title: product.product.title,
            price: product.product.price,
            thumbnail: thumbnailData,
            quantity: product.quantity,
          };
        });

        return res.render("cart", {
          title: "Shopping Cart",
          cartID,
          products: productsData,
          roleAdmin,
          roleUser,
          rolePremium,
        });
      } else {
        return res.render("cart", {
          title: "Shopping Cart",
          products: [],
        });
      }
    } catch (error) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };
}

export const viewController = new ViewsControllers();
