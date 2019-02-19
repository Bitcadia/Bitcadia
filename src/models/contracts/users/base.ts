import { Contract, IContract } from '../contract';

export interface IBaseUser extends IContract {
  seed: string;
  setup?: boolean;
}
