export default class UserResCurrent {
  constructor(user) {
    this.name = user.first_name;
    this.surname = user.last_name;
    this.email = user.email;
  }
}
