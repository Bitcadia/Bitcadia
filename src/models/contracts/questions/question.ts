import { Contract, IContract, Key } from '../contract';
import { IBaseQuestion } from './base';

@Contract.DataContext.register<IBaseQuestion>("Question")
export class Question extends Contract<IBaseQuestion> implements IBaseQuestion {
    public bounty: number;
    public title: string;
    public content: string;
    constructor(entity: IBaseQuestion) {
        super(entity);
    }
}