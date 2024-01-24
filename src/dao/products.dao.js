import { productsModel } from "../models/products.model.js";
import BasicDAO from "./basic.dao.js";
import { env } from "../utils/config.js";

class ProductsDAO extends BasicDAO {
  constructor() {
    super(productsModel);
  }

  async paginate(obj) {
    const { limit = 10, page = 1, order = 0, ...query } = obj;
    let sort;
    if (+order === 1) {
      sort = "price";
    } else if (+order === -1) {
      sort = "-price";
    }

    try {
      const result = await productsModel.paginate(query, {
        limit,
        page,
        sort,
        lean: true,
      });
      // console.log(result);
      const info = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${env.URL}:${env.PORT}/products?limit=${limit}&page=${result.prevPage}`
          : null,
        nextLink: result.hasNextPage
          ? `${env.URL}:${env.PORT}/products?limit=${limit}&page=${result.nextPage}`
          : null,
      };
      return info;
    } catch (error) {
      throw error;
    }
  }
}

export const productsDAO = new ProductsDAO();
