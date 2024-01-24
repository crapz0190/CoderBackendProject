export default class BasicDAO {
  constructor(model, populateProps) {
    this.model = model;
    this.populateProps = populateProps;
  }
  async getAll() {
    try {
      const response = await this.model.find();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getById(id) {
    try {
      const response = await this.model
        .findById(id)
        .populate(this.populateProps);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async createOne(obj) {
    try {
      const response = await this.model.create(obj);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateOne(id, obj) {
    try {
      const response = await this.model.findByIdAndUpdate(id, obj);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteOne(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
