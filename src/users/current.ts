import { IBaseUser } from "../models/contracts/users/base";
import { Contract } from "../models/contracts/contract";
import { User } from "../models/contracts/users/user";

export class CurrentUser {
  public static user: IBaseUser = null;
  public static decryptedUser: IBaseUser = null;
  public static login = (password: string) => {
    CurrentUser.decryptedUser = CurrentUser.user;
  }
  public static logOut = () => {
    CurrentUser.decryptedUser = null;
  }
  public clearUser = () => {
    CurrentUser.user && Contract.DataContext.getInstance().remove(<User>CurrentUser.user);
  }
}

export function GetCurrentUser(): Promise<IBaseUser> {
  return CurrentUser.user ? new Promise((res) => res(CurrentUser.user)) : Contract.DataContext.getContracts<IBaseUser>(User).then((results) => {
    return CurrentUser.user = results && results[0];
  });
}

GetCurrentUser();
