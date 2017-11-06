import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseCitation extends Contract {
    actor: IBaseUser;
}