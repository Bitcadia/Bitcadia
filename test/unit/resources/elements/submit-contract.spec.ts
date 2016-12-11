import { Contract } from '../../../../src/models/contracts/contract';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import * as Q from 'bluebird';
import * as testUtil from '../../util.js';

describe('Element "submit-contract"', () => {
    let component;
    let model;
    let addNewStub: sinon.SinonStub;
    let allDocsStub: sinon.SinonStub;
    beforeEach((done) => {
        model = {
            contract: {
                _id: null,
                roles: ["Thing"],
                name: ""
            },
            addNew: () => {
                return null;
            }
        };
        addNewStub = sinon.stub(model, "addNew");
        component = StageComponent
            .withResources('resources/elements/submit-contract')
            .inView(`<submit-contract contract.bind="contract" add-new-call-back.bind="addNew"></submit-contract>`)
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
                return testUtil.waitUntil(() => model.contract._id)
            }).then((idFound) => {
                expect(idFound).is.true;
                document.querySelector('button').click();
                return testUtil.waitUntil(() => addNewStub.called);
            }).then((addNewCalled) => {
                expect(addNewCalled).is.true;
                done();
            });
    });
    afterEach(() => {
        component.dispose();
        addNewStub.restore();
        allDocsStub.restore();
    });
});