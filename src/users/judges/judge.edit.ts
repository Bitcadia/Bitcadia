import { IContract } from "../../models/contracts/contract";
import { DataContext, DBType } from "../../models/contracts/dataContext";
import { IBaseUser } from "../../models/contracts/users/base";
import { User } from '../../models/contracts/users/user';
import { IBaseJudge } from "../../models/contracts/judges/base";
import { Judge } from "../../models/contracts/judges/judge";
import { IBaseFederation } from "../../models/contracts/federations/base";
import { Federation } from "../../models/contracts/federations/federation";
import { Edit } from "resources/contractModule";
import { RouteNames } from "app";
import { autoinject } from "aurelia-framework";

@autoinject
export default class ViewModel implements Edit {
  public postCreate = RouteNames.setup;
  public dbtype: DBType = "Cart";
  public contract: IBaseJudge;
  public actorOptions: IBaseUser[];
  public judgeOptions: IBaseJudge[];
  public federationOptions: IBaseFederation[];

  constructor(dataContext: DataContext) {
    dataContext.getContracts<IBaseUser>(User, "Cart").then((results) => {
      this.actorOptions = results;
    });
    dataContext.getContracts<Judge>(Judge, "Cart").then((results) => {
      this.judgeOptions = results;
    });
    dataContext.getContracts<Federation>(Federation, "Cart").then((results) => {
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
