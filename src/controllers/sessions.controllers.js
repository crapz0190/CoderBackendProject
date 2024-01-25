import { userRepository } from "../services/repository/users.repository.js";
import { hashData, compareData } from "../utils/config.js";
import UserResCurrent from "../dto/user.current.res.dto.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages } from "../errors/errors.messages.js";
import { transporter } from "../utils/nodemailer.js";
import { env } from "../utils/config.js";
import { v4 as uuidv4 } from "uuid";

class SessionController {
  // Metodo PUT permite cambiar de usuario ("user", "premium" or "admin")
  userRole = async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    try {
      const user = await userRepository.findById(uid);
      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found" });
      }

      // user.role = user.role === "admin" ? "premium" : "admin";
      user.role = role;
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "User role updated successfully",
      });
    } catch (e) {
      console.error("Error al cambiar el rol del usuario", error);
      return res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  };

  // Metodo GET permite desde un boton cerrar sesion
  destroySession = (req, res) => {
    try {
      return req.session.destroy(() => {
        res.redirect("/login");
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo POST permite registrarse en la DB
  access = async (req, res) => {
    try {
      const user = await userRepository.findByEmail(req.user.email);
      const userDTO = new UserResCurrent(user);
      console.log("USER DTO ---> ", userDTO);
      return res.redirect("/products");
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // Metodo POST permite el ingreso del usuario a su cuenta
  loginUser = (req, res) => {
    try {
      res.redirect("/api/users/current");
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  };

  // Metodo POST permite restaurar contraseña
  restorePassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
      const user = await userRepository.findToken({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return res.redirect("/expired-link");
      }

      if (newPassword === confirmPassword) {
        const verifyPass = await compareData(newPassword, user.password);

        if (!verifyPass) {
          const hashPassword = await hashData(newPassword);
          user.password = hashPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          await user.save();
          return res.status(200).json({ message: "Password updated" });
        } else {
          return res
            .status(400)
            .json({ message: "You cannot use the same current password" });
        }
      } else {
        return res.status(400).json({ message: "Passwords do not match" });
      }
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  // ruta POST permite enviar correro para restaurar contraseña
  emailRestorePass = async (req, res) => {
    const { email } = req.body;
    const EXPIRATION_TIME = Date.now() + 3600000; // 1 hora de duración

    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        CustomError.generateError(ErrorsMessages.NOT_FOUND, 404);
      }

      const resetToken = uuidv4();
      user.resetToken = resetToken;
      user.resetTokenExpiration = EXPIRATION_TIME;
      await user.save();

      const resetLink = `${env.URL}:${env.PORT}/reset-password/${resetToken}`;
      const emailBody = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              .button {
                display: inline-block;
                text-decoration: none;
                border: none;
              }
            </style>
          </head>
          <body>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a class="button" href="${resetLink}">Reset password</a></p>
          </body>
        </html>
      `;
      const mailOptions = {
        from: "crapz0190",
        to: email,
        subject: "Mensaje de recuperación de contraseña",
        html: emailBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send("Error sending email");
        }
        res.send("Email Enviado");
      });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  resetPasswordToken = async (req, res) => {
    const { token } = req.params;

    try {
      const user = await userRepository.findToken({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return res.redirect("/expired-link");
      }

      res.render("restore", { token });
    } catch (e) {
      CustomError.generateError(ErrorsMessages.INTERNAL_SERVER_ERROR, 500);
    }
  };

  expiredLink = (req, res) => {
    res.send("The link has expired. Generate a new one.");
  };
}

export const sessionController = new SessionController();
