import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseReferee } from './base';
import { Mixin } from "../mixin";

@Contract.DataContext.register("Referee")
@Contract.DataContext.entityProperty<Referee>("actors").ArrPluck<IBaseActor>("")
@Mixin<Referee, IBaseReferee>([])
export class Referee implements Contract, IBaseReferee {
    public roles: string[];
    public signatures: string[];
    public signAndSave: (key?: Key) => void;
    public _id: string;
    public actors: IBaseActor[];
    constructor(entity: IBaseReferee) {
    }
}