import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';

export interface IBaseQuestion extends Contract {
    bounty: number;
    content: string;
}