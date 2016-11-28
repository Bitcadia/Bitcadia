import { SignedActor } from '../models/contracts/actors/signed';
import { FreeActor } from '../models/contracts/actors/free';
import { Contract, IContract } from '../models/contracts/contract';
/**
 * ContractModule
 */
@ContractModule.register()
export class ContractModule {
    public static instance: ContractModule;
    static register() {
        return (constructor: Function) => {
            ContractModule.instance = new ContractModule();
        }
    }
    private addEdit(contract: Function, moduleId: string) {
        this.edit.set(Contract.DataContext.getRegistry(contract).roles.join('.'), moduleId);
    }
    private addView(contract: Function, moduleId: string) {
        this.edit.set(Contract.DataContext.getRegistry(contract).roles.join('.'), moduleId);
    }
    private getEdit(contract: IContract) {
        return this.edit.get(contract.roles.join('.'));
    }
    private getView(contract: IContract) {
        return this.edit.get(contract.roles.join('.'));
    }
    public static getEdit(contract: IContract) {
        return this.instance.getEdit(contract);
    }
    public static getView(contract: IContract) {
        return this.instance.getView(contract);
    }
    private constructor() {
        this.addEdit(FreeActor, "users/free-actor.html");
        this.addEdit(SignedActor, "users/signed-actor.html");
    }
    private edit: Map<string, string> = new Map();
    private view: Map<string, string> = new Map();
}