import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';

export interface IBaseReferee extends Contract {
    actor: IBaseActor;
}