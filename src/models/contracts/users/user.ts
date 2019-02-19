import { Contract, IContract } from '../contract';
import { IBaseUser } from './base';

@Contract.DataContext.register("User")
export class User extends Contract<IBaseUser> implements IBaseUser {
  public seed: string;
  public password: string;
  public setup?: boolean;
}
