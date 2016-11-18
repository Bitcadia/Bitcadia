import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseActor } from '../models/contracts/actors/base';

interface ActorSelection {
    factory: () => IBaseActor,
    instance?: IBaseActor,
    template: string,
    displayName: string
}
export class Index {
    private static ActorOptions: ActorSelection[] = [
        { factory: () => new FreeActor(null), displayName: "User", template: "free-actor" },
        { factory: () => new SignedActor(null), displayName: "Signed User", template: "signed-actor" }
    ]
    public ActorsDropDownOptions: ActorSelection[];
    public SelectedActorType: ActorSelection;
}