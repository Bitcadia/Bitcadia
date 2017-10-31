import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from './base';

@Contract.DataContext.register("Referee",[])
@Contract.DataContext.entityProperty<Referee>("actor")
export class Referee extends Contract<IBaseReferee> implements IBaseReferee {
    public actor: IBaseActor;
    constructor(entity: IBaseReferee) {
        super(entity);
    }
}