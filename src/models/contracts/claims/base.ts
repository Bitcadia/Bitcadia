import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from '../referees/base';

export interface IBaseClaim extends IContract {
    actor: IBaseActor;
    referees: IBaseReferee[];
}