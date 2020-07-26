import { DataContext, DBType, IContractCtor } from '../models/contracts/dataContext';
import { Contract, IContract } from '../models/contracts/contract';
import { RouteNames } from '../app';
import { User } from 'models/contracts/users/user';
import { Judge } from 'models/contracts/judges/judge';
import { ValidationController } from 'aurelia-validation';
import { autoinject, singleton } from 'aurelia-framework';
import Q = require('bluebird');


export const enum ViewType {
  edit = "edit",
  display = "display"
}
export interface Edit {
  activate(model: IContract): any;
  dbtype: DBType;
  postCreate: RouteNames | undefined;
}
export interface View {
  fullView: RouteNames;
}
interface ViewCtor {
  default: {
    new(...args): View;
  };
}
interface EditCtor {
  default: {
    new(...args): Edit;
  };
}
type EditModules = SubType<TSModulePaths, EditCtor>;
type ViewModules = SubType<TSModulePaths, ViewCtor>;

export interface Modules<T extends ViewType> {
  viewModule: keyof HTMLModulePaths;
  viewModelModule: T extends ViewType.edit ? keyof EditModules : keyof ViewModules;
}

/**
 * ContractModule
 */
@autoinject
@singleton()
export class ContractModule {
  public constructor(private context: DataContext) {
    this.addDisplay(User, "users/user.view.html", "users/user.view");
    this.addDisplay(Judge, "users/judges/judge.view.html");

    this.addEdit(User, "users/user.edit.html", "users/user.edit");
    this.addEdit(Judge, "users/judges/judge.edit.html", "users/judges/judge.edit");
  }

  private addDisplay<
    TIContract extends IContract,
    TContract extends Contract<TIContract>
  >(
    contract: IContractCtor<TIContract, TContract>,
    htmlPath: keyof HTMLModulePaths,
    modulePath?: keyof ViewModules
  ) {
    let map = this.map.get(ViewType.display);
    map = map || this.map.set(ViewType.display, map = new Map()) && map;
    const registry = this.context.getRegistry(contract);
    map.set(registry.roles.join('.'), { viewModule: htmlPath, viewModelModule: modulePath });
  }

  private addEdit<
    TIContract extends IContract,
    TContract extends Contract<TIContract>
  >(
    contract: IContractCtor<TIContract, TContract>,
    htmlPath: keyof HTMLModulePaths,
    modulePath?: keyof EditModules
  ) {
    let map = this.map.get(ViewType.edit);
    map = map || this.map.set(ViewType.edit, map = new Map()) && map;
    const registry = this.context.getRegistry(contract);
    map.set(registry.roles.join('.'), { viewModule: htmlPath, viewModelModule: modulePath });
  }

  public getView<T extends ViewType>(contract: IContract, viewType: T) {
    const map = this.map.get(viewType);
    const modules = map && map.get(contract.roles.join('.'));
    return modules;
  }

  private map: Map<ViewType, Map<string, Modules<ViewType>>> = new Map();
}

@singleton(ValidationController)
export class ContractValidationController extends ValidationController {
}
