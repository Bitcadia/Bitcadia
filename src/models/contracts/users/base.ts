import { Contract, IContract } from '../contract';

export interface IBaseUser extends IContract {
  name: string;
  seed: string;
  setup?: boolean;
}
