import { Contract, IContract } from "../../models/contracts/contract";
import { IBaseUser } from "../../models/contracts/users/base";
import { User } from '../../models/contracts/users/user';
import { IBaseJudge } from "../../models/contracts/judges/base";
import { Judge } from "../../models/contracts/judges/judge";
import { IBaseFederation } from "../../models/contracts/federations/base";
import { Federation } from "../../models/contracts/federations/federation";

export class ViewModel {
  public contract: IBaseJudge;
  public actorOptions: IBaseUser[];
  public judgeOptions: IBaseJudge[];
  public federationOptions: IBaseFederation[];
  constructor() {
    Contract.DataContext.getContracts<IBaseUser>(User).then((results) => {
      this.actorOptions = results;
    });
    Contract.DataContext.getContracts<Judge>(Judge).then((results) => {
      this.judgeOptions = results;
    });
    Contract.DataContext.getContracts<Federation>(Federation).then((results) => {
      this.federationOptions = results;
    });
  }
  public activate(model) {
    this.contract = model;
  }
  public contractMatcher(contractA: IContract, contractB: IContract) {
    return contractA._id === contractB._id;
  }
}
