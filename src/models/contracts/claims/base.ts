import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseClaim extends IContract {
  actor: IBaseUser;
  title: string;
  content: string;
}
