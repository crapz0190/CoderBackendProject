import { userService } from "../users.service.js";

class UserRepository {
  constructor(userService) {
    this.userRepository = userService;
  }

  findToken = (obj) => {
    return this.userRepository.findToken(obj);
  };

  createOne = (obj) => {
    return this.userRepository.createOne(obj);
  };

  findByEmail = (email) => {
    return this.userRepository.findByEmail(email);
  };

  findById = (uid) => {
    return this.userRepository.findById(uid);
  };
}

export const userRepository = new UserRepository(userService);
