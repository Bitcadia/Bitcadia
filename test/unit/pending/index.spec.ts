import { Contract } from '../../../src/models/contracts/contract';
import { Cart } from '../../../src/pending/index';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Container } from 'aurelia-dependency-injection';
import { StageComponent } from 'aurelia-testing';
import { AppRouter, RouterConfiguration, PipelineProvider } from 'aurelia-router';
import { BrowserHistory, DefaultLinkHandler } from 'aurelia-history-browser';
import { bootstrap } from 'aurelia-bootstrapper';
import * as Q from 'bluebird';
import * as testUtil from '../util.js';

export class App {
    router: AppRouter;
    configureRouter(config, router) {
        this.router = router;
        config.title = 'Aurelia';
        config.map([
            { route: 'pending', name: 'pending', title: 'shell:pending', nav: true, moduleId: 'pending/index', settings: { iconClass: 'fa fa-stack-overflow' } }
        ]);
    }
}
describe('Pending index', () => {
    let component;
    let allDocsStub;
    let router: AppRouter;
    let model: App;
    let container: Container;
    let history: BrowserHistory;
    let config: RouterConfiguration;
    beforeEach((done) => {
        model = new App();
        component = StageComponent
            .withResources('aurelia-templating-router/router-view')
            .inView(`
                <template>
                    <div class="page-host">
                        <router-view name="default"></router-view>
                    </div>
                </template>
            `)
            .boundTo(model);
        component.configure = (aurelia) => {
            return aurelia.use.standardConfiguration().plugin('aurelia-i18n', () => { });
        };
        allDocsStub = sinon.stub(Contract.DataContext.getInstance(),
            'allDocs',
            () => Q.resolve([
                { docs: { roles: ['C1'] } },
                { docs: { roles: ['P1.C1'] } },
                { docs: { roles: ['P1.C2'] } }
            ])
        )
        router = new AppRouter(
            container = new Container(),
            history = new BrowserHistory(new DefaultLinkHandler()),
            new PipelineProvider(container),
            null);
        model.configureRouter(config = new RouterConfiguration(), router);
        router.configure(config);
        Q.all([component.create(bootstrap), model.router.ensureConfigured()])
            .then(() => router.navigateToRoute('pending'))
            .then(() => testUtil.waitUntil(() => !router.isNavigating))
            .then(() => done());
    });
    it('should display contracts', function (done) {
        expect(component.element).to.exist;
        testUtil.waitUntil(() => !!component.element.innerHTML)
            .then((htmlFound) => {
                expect(htmlFound).is.true;
                done();
            });
    });
    afterEach(() => {
        component.dispose();
    });
});