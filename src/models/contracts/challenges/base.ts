import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseChallenge extends Contract {
    actor: IBaseUser;
}