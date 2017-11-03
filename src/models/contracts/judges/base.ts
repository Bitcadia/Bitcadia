import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseFederation } from '../federations/base';

export interface IBaseJudge extends Contract {
    actor: IBaseActor;
    appealJudges: IBaseJudge[];
    federation: IBaseFederation;
}