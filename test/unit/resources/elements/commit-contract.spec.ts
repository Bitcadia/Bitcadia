import { Contract } from '../../../../src/models/contracts/contract';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import * as Q from 'bluebird';
import * as testUtil from '../../util.js';

describe('Element "commit-contract"', () => {
    let component;
    let model;
    let refreshStub;
    let allDocsStub: sinon.SinonStub;
    beforeEach((done) => {
        model = {
            contract: {
                _id: null,
                roles: ["Thing"],
                name: ""
            },
            refresh: () => { }
        };
        refreshStub = sinon.stub(model, 'refresh');
        component = StageComponent
            .withResources('resources/elements/commit-contract')
            .inView(`<commit-contract contract.bind="contract" delete-call-back.bind="refresh"></commit-contract>`)
            .boundTo(model);
        component.configure = (aurelia) => {
            return aurelia.use.standardConfiguration().plugin('aurelia-i18n', () => { });
        };
        allDocsStub = sinon.stub(Contract.DataContext.getInstance(),
            'bulkDocs',
            (contracts: any[]) =>
                Q.resolve(contracts.map((item, index) => { return { id: index + 1 } })));
        component.create(bootstrap).then(() => done());
    });
    it('should submit', function (done) {
        expect(component.element).to.exist;
        testUtil.waitUntil(() => !!component.element.innerHTML)
            .then((htmlFound) => {
                expect(htmlFound).is.true;
                document.querySelector('button').dispatchEvent(new Event('click'));
                return testUtil.waitUntil(() => model.contract._deleted)
            }).then((idFound) => {
                expect(idFound).is.true;
                expect(refreshStub.called).is.true;
                done();
            });
    });
    afterEach(() => {
        component.dispose();
        allDocsStub.restore();
        refreshStub.restore();
    });
});