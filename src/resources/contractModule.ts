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
    private addView(contract: Function, moduleId: string, viewType: string) {
        var map = this.map.get(viewType)
        map = map || this.map.set(viewType,map=new Map()) && map;
        map.set(Contract.DataContext.getRegistry(contract).roles.join('.'), moduleId);
    }
    public static getView(contract: IContract, viewType: string) {
        var map = this.instance.map.get(viewType);
        var module = map && map.get(contract.roles.join('.'));
        var arr = module.split('.html');
        arr[0]+='.'+viewType;
        return arr.join('.html');
    }
    private constructor() {
        this.addView(FreeActor, "users/free-actor.html", "edit");
        this.addView(SignedActor, "users/signed-actor.html", "edit");
        this.addView(FreeActor, "users/free-actor.html", "view");
        this.addView(SignedActor, "users/signed-actor.html", "view");
    }
    private map: Map<string, Map<string,string>> = new Map();
}