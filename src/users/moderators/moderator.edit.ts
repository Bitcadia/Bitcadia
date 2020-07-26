import { DataContext } from '../../models/contracts/dataContext';
import { IBaseUser } from "../../models/contracts/users/base";
import { User } from "../../models/contracts/users/user";
import { IBaseClaim } from "../../models/contracts/claims/base";
import { autoinject } from "aurelia-framework";

@autoinject
export class ViewModel {
  public contract: IBaseClaim;
  public actorOptions: IBaseUser[];

  constructor(dataContext: DataContext) {
    dataContext.getContracts<IBaseUser>(User, "Cart").then((results) => {
      this.actorOptions = results;
    });
  }
  public activate(model) {
    this.contract = model;
  }
}
