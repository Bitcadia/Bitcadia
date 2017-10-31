import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseClaim extends Contract {
    actor: IBaseActor;
}