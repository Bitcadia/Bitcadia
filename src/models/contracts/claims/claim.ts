import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseClaim } from './base';
import { IBaseQuestion } from '../questions/base';

@Contract.DataContext.register("Claim")
@Contract.DataContext.entityProperty<IBaseClaim>("actor")
@Contract.DataContext.entityProperty<IBaseClaim>("question")
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
    public title: string;
    public content: string;
    public question: IBaseQuestion;
    public actor: IBaseActor;
    constructor(entity: IBaseClaim) {
        super(entity);
    }
}