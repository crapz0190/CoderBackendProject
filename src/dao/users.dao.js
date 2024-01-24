import { usersModel } from "../models/users.model.js";
import BasicDAO from "./basic.dao.js";
import { compareData } from "../utils/config.js";

class UserDAO extends BasicDAO {
  constructor() {
    super(usersModel);
  }

  async findByEmail(email) {
    try {
      const response = await usersModel.findOne({ email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findToken(obj) {
    try {
      const response = await usersModel.findOne(obj);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const usersDAO = new UserDAO();
