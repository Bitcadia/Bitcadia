import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseFederation extends Contract {
    actor: IBaseUser;
}