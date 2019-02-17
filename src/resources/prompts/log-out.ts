import { Clear } from './clear';
import { CurrentUser } from '../../users/current';
import { DialogService } from 'aurelia-dialog';
import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@autoinject()
export class LogOut {
  public password = null;
  public errors = [];
  constructor(public dialogController: DialogController, public dialogService: DialogService) {
    dialogController.settings.lock = false;
    dialogController.settings.centerHorizontalOnly = true;
  }

  public clear() {
    this.dialogService.open({ viewModel: Clear })
      .whenClosed((result) => {
        if (!result.wasCancelled) this.dialogController.cancel();
      });
  }

  public logOut() {
    CurrentUser.decryptedUser = null;
    this.dialogController.ok();
  }
}
