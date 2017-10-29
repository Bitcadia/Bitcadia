import { App } from '../../src/app';
import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { AppRouter, PipelineProvider, RouterConfiguration, NavModel } from 'aurelia-router';
import { History } from 'aurelia-history';

var absoluteRoot = '/';
class MockHistory extends History {
  activate(opts) { return !0 }
  deactivate() { }
  navigate(frag, opts) { return !0 }
  navigateBack() { }
  getAbsoluteRoot() {
    return absoluteRoot;
  }
}

describe('app', () => {
  let component;

  let router: AppRouter;
  let history: History;
  let container: Container
  let app: App;
  let config: RouterConfiguration;
  beforeEach(() => {
    router = new AppRouter(
      container = new Container(),
      history = new MockHistory(),
      new PipelineProvider(new Container()),
      null);
    app = new App();
    app.configureRouter(config = new RouterConfiguration(), router);
    router.configure(config);
    return app.router.ensureConfigured();
  });

  it('should render navigation', function (done) {
    expect(app.groupedNavigation[0].title).to.equal("shell:user");
    expect(app.groupedNavigation[0].settings.children[0].title).to.equal("shell:create");
    expect(app.groupedNavigation[1].title).to.equal("shell:referees");
    expect(app.groupedNavigation[1].settings.children[0].title).to.equal("shell:createReferee");
    expect(app.groupedNavigation[2].title).to.equal("shell:pending");
    done();
  });
});