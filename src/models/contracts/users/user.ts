import { DataContext } from '../dataContext';
import { Contract } from '../contract';
import { IBaseUser } from './base';

@DataContext.register()
export class User extends Contract<IBaseUser> implements IBaseUser {
  public static contractName = "User";
  public name: string;
  public seed: string;
  public password: string;
  public setup?: boolean;
}
