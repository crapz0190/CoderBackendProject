import { cartService } from "../carts.service.js";

class CartRepository {
  constructor(cartService) {
    this.cartRepository = cartService;
  }

  findAll = () => {
    return this.cartRepository.findAll();
  };

  findById = (cid) => {
    return this.cartRepository.findById(cid);
  };

  createOne = () => {
    return this.cartRepository.createOne();
  };

  updateCart = (cid, pid, quantity, userId) => {
    return this.cartRepository.updateCart(cid, pid, quantity, userId);
  };

  deleteOne = (cid) => {
    return this.cartRepository.deleteOne(cid);
  };

  deleteProductByCart = (cid, pid) => {
    return this.cartRepository.deleteProductByCart(cid, pid);
  };
}

export const cartRepository = new CartRepository(cartService);
