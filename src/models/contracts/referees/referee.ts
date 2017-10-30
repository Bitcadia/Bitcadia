import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from './base';
import { Mixin } from "../mixin";

@Contract.DataContext.register("Referee")
@Contract.DataContext.entityProperty<Referee>("actor")
@Mixin<Referee, IBaseReferee>([])
export class Referee extends Contract<IBaseReferee> implements IBaseReferee {
    public actor: IBaseActor;
    constructor(entity: IBaseReferee) {
        super(entity);
    }
}