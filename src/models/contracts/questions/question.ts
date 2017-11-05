import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseQuestion } from './base';

@Contract.DataContext.register("Question")
@Contract.DataContext.entityProperty<Question>("actor")
export class Question extends Contract<IBaseQuestion> implements IBaseQuestion {
    public actor: IBaseActor;
    constructor(entity: IBaseQuestion) {
        super(entity);
    }
}