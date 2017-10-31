import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseChallenge } from './base';

@Contract.DataContext.register("Challenge")
@Contract.DataContext.entityProperty<Challenge>("actor")
export class Challenge extends Contract<IBaseChallenge> implements IBaseChallenge {
    public actor: IBaseActor;
    constructor(entity: IBaseChallenge) {
        super(entity);
    }
}