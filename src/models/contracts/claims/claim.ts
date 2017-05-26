import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from '../referees/base';
import { IBaseClaim } from './base';

@Contract.DataContext.register("Claim")
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
    public actor: IBaseActor;
    public referees: IBaseReferee[];
}