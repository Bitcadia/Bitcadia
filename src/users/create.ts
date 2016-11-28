import { ContractModule } from '../resources/contractModule';
import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseActor } from '../models/contracts/actors/base';

interface ActorSelection {
    factory: () => IBaseActor,
    instance?: IBaseActor,
    displayName: string
}
export class Create {
    private static ActorOptions: () => ActorSelection[] = () => {
        return [
            { factory: () => new FreeActor(null), displayName: "user:unsignedUser"},
            { factory: () => new SignedActor(null), displayName: "user:signedUser"}
        ]
    }

    public selectedUserType: ActorSelection;

    @computedFrom('selectedUserType', 'selectedUserType.instance')
    get contract(): IBaseActor {
        return this.selectedUserType &&
            (this.selectedUserType.instance ||
                (this.selectedUserType.instance = this.selectedUserType.factory())
            );
        
    }
    public ActorsDropDownOptions: ActorSelection[];
    constructor() {
        this.ActorsDropDownOptions = Create.ActorOptions();
    }
}