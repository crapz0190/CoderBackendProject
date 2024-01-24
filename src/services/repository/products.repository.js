import { productService } from "../products.service.js";

class ProductRepository {
  constructor(productService) {
    this.productRepository = productService;
  }

  paginate = (obj) => {
    return this.productRepository.paginate(obj);
  };

  findById = (pid) => {
    return this.productRepository.findById(pid);
  };

  createOne = (obj) => {
    return this.productRepository.createOne(obj);
  };

  updateOne = (pid, obj) => {
    return this.productRepository.updateOne(pid, obj);
  };

  deleteOne = (pid) => {
    return this.productRepository.deleteOne(pid);
  };
}

export const productRepository = new ProductRepository(productService);
