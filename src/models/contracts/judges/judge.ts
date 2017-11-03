import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseJudge } from './base';
import { IBaseFederation } from "../federations/base";

@Contract.DataContext.register("Judge", [])
@Contract.DataContext.entityProperty<IBaseJudge>("actor")
@Contract.DataContext.entityProperty<IBaseJudge>("federation")
@Contract.DataContext.entityProperty<IBaseJudge>("appealJudges").ArrPluck("")
export class Judge extends Contract<IBaseJudge> implements IBaseJudge {
    public actor: IBaseActor;
    public appealJudges: IBaseJudge[];
    public federation: IBaseFederation;
    constructor(entity: IBaseJudge) {
        super(entity);
    }
}