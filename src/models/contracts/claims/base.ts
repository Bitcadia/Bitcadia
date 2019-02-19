import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseClaim extends Contract {
  actor: IBaseUser;
  title: string;
  content: string;
}
