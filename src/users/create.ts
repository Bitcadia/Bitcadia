import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseActor } from '../models/contracts/actors/base';

interface ActorSelection {
    factory: () => IBaseActor,
    instance?: IBaseActor,
    template: string,
    displayName: string
}
export class Create {
    private static ActorOptions: () => ActorSelection[] = () => {
        return [
            { factory: () => new FreeActor(null), displayName: "user:unsignedUser", template: "./free-actor.html" },
            { factory: () => new SignedActor(null), displayName: "user:signedUser", template: "./signed-actor.html" }
        ]
    }

    public selectedUserType: ActorSelection;
    
    @computedFrom('selectedUserType','selectedUserType.instance')
    get actor(): IBaseActor {
        return this.selectedUserType && (this.selectedUserType.instance || (this.selectedUserType.instance = this.selectedUserType.factory()));
    }

    public ActorsDropDownOptions: ActorSelection[];
    constructor() {
        this.ActorsDropDownOptions = Create.ActorOptions();
    }
}