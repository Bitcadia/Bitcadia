import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseChallenge extends IContract {
  actor: IBaseUser;
}
