import { App } from './app';
import { Container } from 'aurelia-dependency-injection';
import { AppRouter, PipelineProvider, RouterConfiguration } from 'aurelia-router';
import { History } from 'aurelia-history';

const absoluteRoot = '/';
class MockHistory extends History {
  activate(_opts: any) { return !0; }
  deactivate() { }
  navigate(_frag: any, _opts: any) { return !0; }
  navigateBack() { }
  getAbsoluteRoot() {
    return absoluteRoot;
  }
}

describe('app', () => {
  let router: AppRouter;
  let app: App;
  let config: RouterConfiguration;
  beforeEach(() => {
    const container = new Container();
    router = new AppRouter(
      new Container(),
      new MockHistory(),
      new PipelineProvider(new Container()),
      null);
    app = container.invoke(App);
    app.configureRouter(config = new RouterConfiguration(), router);
    router.configure(config);
    return router.ensureConfigured();
  });

  it('should render navigation', function (done) {
    done();
  });
});
