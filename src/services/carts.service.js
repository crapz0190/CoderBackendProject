import { cartsDAO } from "../dao/carts.dao.js";

class CartService {
  findAll = async () => {
    const carts = await cartsDAO.getAll();
    return carts;
  };

  findById = async (cid) => {
    const carts = await cartsDAO.getById(cid);
    return carts;
  };

  createOne = async () => {
    const carts = await cartsDAO.createCart();
    return carts;
  };

  updateCart = async (cid, pid, quantity, userId) => {
    const carts = await cartsDAO.addProductsByCart(cid, pid, quantity, userId);
    return carts;
  };

  deleteOne = async (cid) => {
    const carts = await cartsDAO.deleteOne(cid);
    return carts;
  };

  deleteProductByCart = async (cid, pid) => {
    const carts = await cartsDAO.deleteProductByCart(cid, pid);
    return carts;
  };
}
export const cartService = new CartService();
