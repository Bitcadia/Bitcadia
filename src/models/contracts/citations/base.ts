import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseCitation extends Contract {
    actor: IBaseActor;
}