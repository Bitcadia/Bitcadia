import { CurrentUser } from '../../users/current';
import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { DataContext } from "../../models/contracts/dataContext";

@autoinject
export class Clear {
  public password = null;
  public errors = [];
  public seed = this.currentUser.decryptedUser.seed;
  constructor(private currentUser: CurrentUser, private dataContext: DataContext, public dialogController: DialogController) {
    dialogController.settings.lock = false;
    dialogController.settings.centerHorizontalOnly = true;
  }

  public clear() {
    this.dataContext.getInstance("Account").remove(this.currentUser.decryptedUser).then(() => {
      this.currentUser.users = [];
      this.currentUser.decryptedUser = null;
      this.dialogController.ok();
    });
  }
}
