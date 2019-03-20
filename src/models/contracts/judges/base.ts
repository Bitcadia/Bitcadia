import { IContract } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseFederation } from '../federations/base';

export interface IBaseJudge extends IContract {
  actor: IBaseUser;
  appealJudges: IBaseJudge[];
  federation: IBaseFederation;
}
