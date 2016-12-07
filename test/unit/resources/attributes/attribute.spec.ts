import { expect } from 'chai';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import * as util from '../../util.js';

describe('Custom Attribute "attribute"', () => {
    let component;
    let model;
    beforeEach((done) => {
        component = StageComponent
            .withResources('resources/attributes/attribute')
            .inView('<input attribute="disabled.bind:disabled;"/>')
            .boundTo(model = { disabled: true });

        component.create(bootstrap).then(() => done());
    });

    it('should set and unset property disabled', function (done) {
        expect(component.element.disabled).to.true;
        model.disabled = false;
        util.waitUntil(() => !component.element.disabled)
            .then((disabled) => {
                expect(disabled).to.true;
                done();
            });
    });

    afterEach(() => {
        component.dispose();
    });
});