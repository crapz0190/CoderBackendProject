import { usersDAO } from "../dao/users.dao.js";

class UserService {
  findToken = async (obj) => {
    const users = await usersDAO.findToken(obj);
    return users;
  };

  createOne = async (obj) => {
    const users = await usersDAO.createOne(obj);
    return users;
  };

  findByEmail = async (email) => {
    const users = await usersDAO.findByEmail(email);
    return users;
  };

  findById = async (uid) => {
    const users = await usersDAO.getById(uid);
    return users;
  };
}
export const userService = new UserService();
