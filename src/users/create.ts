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
            { factory: () => new FreeActor(null), displayName: "user:unsignedUser" },
            { factory: () => new SignedActor(null), displayName: "user:signedUser" }
        ]
    }

    @computedFrom('selectedUserType', 'selectedUserType.instance')
    get contract(): IBaseActor {
        return this.selectedUserType &&
            (this.selectedUserType.instance ||
                (this.selectedUserType.instance = this.selectedUserType.factory())
            );
    }

    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }

    public selectedUserType: ActorSelection;
    public ActorsDropDownOptions: ActorSelection[];

    constructor() {
        this.ActorsDropDownOptions = Create.ActorOptions();
    }

    public addNew() {
        var create = this;
        return ()=>{
            create.selectedUserType.instance = create.selectedUserType.factory();
        }
    }
}