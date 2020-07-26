import { NavModel, Router, AppRouter } from 'aurelia-router';
import { bindable, customElement, containerless, autoinject } from 'aurelia-framework';
import _ from 'lodash';

@autoinject
@containerless()
@customElement('nav-bar')
export class NavBar {
  @bindable router: Router;
  @bindable navtype: Nav = null;
  @bindable navigation: NavModel[];
  @bindable group;
  constructor(public appRouter: AppRouter) {
  }

  public attached() {
    this.navigation = this.navigation || this.groups();
  }

  public clickDelegate(nav: NavModel) {
    nav.config.settings && (nav.config.settings.parent || !nav.config.settings.children) && this.router.navigateToRoute(nav.config.name);
  }

  private groups(): NavModel[] {
    const navigation = this.appRouter.navigation.filter((nav) => (nav.config.nav && nav.config.nav === this.navtype) ? nav : null);
    const children = _(navigation)
      .filter("settings.parent")
      .groupBy("settings.parent").value();

    return _(navigation)
      .map((nav) => {
        if (!nav.settings || !nav.settings.group) {
          return nav;
        }
        nav.settings.children = children[nav.settings.group];
        return nav;
      })
      .filter((nav) => !!nav)
      .reject("settings.parent")
      .value() as NavModel[];
  }
}

export const enum Nav {
  None = 0,
  Setup = 1
}
