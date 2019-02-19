import { User } from '../../models/contracts/users/user';
import { CurrentUser } from '../../users/current';
import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { Contract } from '../../models/contracts/contract';

@autoinject()
export class Clear {
  public password = null;
  public errors = [];
  public seed = CurrentUser.decryptedUser.seed;
  constructor(public dialogController: DialogController) {
    dialogController.settings.lock = false;
    dialogController.settings.centerHorizontalOnly = true;
  }

  public clear() {
    Contract.DataContext.getInstance().remove(<User>CurrentUser.user).then(() => {
      CurrentUser.user = null;
      CurrentUser.decryptedUser = null;
      this.dialogController.ok();
    });
  }
}
