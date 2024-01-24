import { productsDAO } from "../dao/products.dao.js";

class ProductService {
  paginate = async (obj) => {
    const products = await productsDAO.paginate(obj);
    return products;
  };

  findById = async (pid) => {
    const products = await productsDAO.getById(pid);
    return products;
  };

  createOne = async (obj) => {
    const products = await productsDAO.createOne(obj);
    return products;
  };

  updateOne = async (pid, obj) => {
    const products = await productsDAO.updateOne(pid, obj);
    return products;
  };

  deleteOne = async (pid) => {
    const products = await productsDAO.deleteOne(pid);
    return products;
  };
}
export const productService = new ProductService();
