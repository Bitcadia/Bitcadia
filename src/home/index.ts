import { customElement, autoinject, computedFrom } from 'aurelia-framework';
import { DialogService, DialogOpenPromise, DialogCancellableOpenResult } from 'aurelia-dialog';
import { CurrentUser } from '../users/current';
import { AppRouter } from 'aurelia-router';
import { LogIn } from '../resources/prompts/log-in';
import { RouteNames } from 'app';

const contactsJson: any[] = [].map((item) => {
  item.json = JSON.stringify(item);
  return item;
});

interface Contacts {
  "id": number;
  "first_name": string;
  "last_name": string;
  "email": string;
  "country": string;
  "modified": string;
  "vip": boolean;
  "json": string;
}
@customElement('log-in-out')
@autoinject
export class Index {
  public filterString: string;

  constructor(
    public currentUser: CurrentUser,
    public dialogService: DialogService,
    public router: AppRouter) {

  }

  @computedFrom("filterString", "currentUser.decryptedUser")
  public get contacts(): Contacts[] {
    if (!this.filterString) {
      return contactsJson;
    }
    const tokens = this.filterString.split(" ");
    return contactsJson.filter((item) => this.filter(item, tokens));
  }

  public filter(item: Contacts, tokens: string[]) {
    return tokens.every((token) => item.json.includes(token));
  }
}
