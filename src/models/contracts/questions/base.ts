import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseQuestion extends Contract {
    bounty: number;
    content: string;
}