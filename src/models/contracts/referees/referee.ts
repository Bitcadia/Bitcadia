import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from './base';

@Contract.DataContext.register("Referee")
@Contract.DataContext.entityProperty("actors[]")
export class Referee extends Contract<IBaseReferee> implements IBaseReferee {
    public actors: IBaseActor[];
}