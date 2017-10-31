import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseChallenge extends Contract {
    actor: IBaseActor;
}