import { Contract, IContract } from '../contract';

export interface IBaseActor extends IContract {
    name: string;
}


@Contract.DataContext.register("Actor")
export class BaseActor extends Contract<IBaseActor> implements IBaseActor{
    name: string;   
}