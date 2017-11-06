import { ContractModule } from '../resources/contractModule';
import { bindable, computedFrom } from 'aurelia-framework';
import { User } from '../models/contracts/users/user';
import { IBaseUser } from '../models/contracts/users/base';

interface UserSelection {
    factory: () => IBaseUser,
    instance?: IBaseUser,
    displayName: string
}
export class Create {
    private static UserOptions: () => UserSelection[] = () => {
        return [
            { factory: () => new User(null), displayName: "user:user" }
        ]
    }

    @computedFrom('selectedUserType', 'selectedUserType.instance')
    get contract(): IBaseUser {
        return this.selectedUserType &&
            (this.selectedUserType.instance ||
                (this.selectedUserType.instance = this.selectedUserType.factory())
            );
    }

    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }

    public selectedUserType: UserSelection;
    public UsersDropDownOptions: UserSelection[];

    constructor() {
        this.UsersDropDownOptions = Create.UserOptions();
    }

    public addNew() {
        var create = this;
        return () => {
            create.selectedUserType.instance = create.selectedUserType.factory();
        }
    }
}