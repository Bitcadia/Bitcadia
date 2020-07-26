import { DataContext } from "../models/contracts/dataContext";
import { User } from "../models/contracts/users/user";
import { singleton } from "aurelia-framework";

@singleton()
export class CurrentUser {
  private _usersPromise: Promise<User[]>;

  public users: User[] = [];
  public decryptedUser: User = null;

  constructor(public dataContext: DataContext) {
    this.loadUsers();
  }

  public async loadUsers() {
    return this.dataContext.getContracts<User>(User, "Account").then((results) => {
      return this.users = results;
    });
  }

  public get usersPromise() {
    return this._usersPromise = this._usersPromise ||
      this.users.length ? new Promise((res) => res(this.users)) :
      this.loadUsers();
  }

  public async login(name: string, password: string) {
    const users = await this.loadUsers();
    return this.decryptedUser = (this.users = users).find((user) => user.name == name && user.password === password);
  }

  public logout() {
    this.decryptedUser = null;
  }

  public clearUser() {
    this.decryptedUser && this.dataContext.getInstance("Account").remove(this.decryptedUser);
    this._usersPromise = null;
  }
}
