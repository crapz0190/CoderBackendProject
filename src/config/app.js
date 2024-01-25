import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join } from "node:path";
import { _dirname } from "../utils/config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { env } from "../utils/config.js";
import passport from "passport";
import "./passport.js";
import viewsRouter from "../routes/views.routes.js";
import productsRouter from "../routes/products.routes.js";
import cartsRouter from "../routes/carts.routes.js";
import messagesRouter from "../routes/messages.routes.js";
import sessionsRouter from "../routes/sessions.routes.js";
import { productRepository } from "../services/repository/products.repository.js";
import { userRepository } from "../services/repository/users.repository.js";
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import methodOverride from "method-override";
import { errorMiddleware } from "../middlewares/error.middlewares.js";
import { logger } from "../utils/logger.js";

const app = express();
const server = createServer(app);
const io = new SocketServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(_dirname, "public")));
app.use("/images", express.static(join(_dirname, "public", "images")));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

// session MongoStore
if (env.URI_MONGO) {
  app.use(
    session({
      store: new MongoStore({
        mongoUrl: env.URI_MONGO,
      }),
      secret: env.TOKEN_SECRET_MONGO,
      cookie: { maxAge: 3600000 },
    }),
  );
} else {
  logger.warning("Conectarse a MongoDB para iniciar sesión");
}

// passport
app.use(passport.initialize());
app.use(passport.session());

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", join(_dirname, "views"));

// routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/users", sessionsRouter);

app.use(errorMiddleware);

export default server;

io.on("connection", (socketServer) => {
  logger.info(`New client connected: ${socketServer.id}`);

  // -------------  actualizar/eliminar producto  -------------
  socketServer.on("idUpdateProducts", async (data) => {
    const pid = data.productId;

    const idFound = await productRepository.findById(pid);
    socketServer.emit("loadListProducts", idFound);
  });

  socketServer.on("updateListProducts", async (update) => {
    const id = update.idProductForm;
    await productRepository.updateOne(id, update);
  });

  socketServer.on("idDeleteProducts", async (data) => {
    const pid = data.productId;
    const foundProduct = await productRepository.findById(pid);
    const roleOwner = foundProduct.owner.find((item) => item.idUser);

    const user = await userRepository.findById(roleOwner.idUser);

    if (!foundProduct._id) {
      logger.warning("Product not found");
    } else {
      const userRole = user.role;
      if (
        userRole === "admin" ||
        (userRole === "premium" && roleOwner.role === "premium")
      ) {
        const deleteProduct = await productRepository.deleteOne(pid);
        socketServer.emit("loadListProducts", deleteProduct);
      } else if (userRole === "premium" && roleOwner.role === "admin") {
        logger.fatal("You don't have permission to delete this product");
      }
    }
  });
});
