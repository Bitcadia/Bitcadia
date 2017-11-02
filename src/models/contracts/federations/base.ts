import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseFederation extends Contract {
    actor: IBaseActor;
}