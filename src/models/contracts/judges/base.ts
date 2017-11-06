import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseFederation } from '../federations/base';

export interface IBaseJudge extends Contract {
    actor: IBaseUser;
    appealJudges: IBaseJudge[];
    federation: IBaseFederation;
}